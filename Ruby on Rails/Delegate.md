 

# **Delegate**

[https://qiita.com/shimizuyuta/items/27159df6088ee9794ac8](https://qiita.com/shimizuyuta/items/27159df6088ee9794ac8)

toで指定したclassに対して、そのメソッドの呼び出しの結果を移譲(よびだしを受けたわたすイメージ)

[https://qiita.com/shimizuyuta/items/27159df6088ee9794ac8](https://qiita.com/shimizuyuta/items/27159df6088ee9794ac8)

delegateしている際には、委譲を任されているクラスでprivateで定義すると、呼び出し元では参照できない。

e.g. Annoucement

```Ruby
# == Schema Information
#
# Table name: announcements
#
#  id                     :bigint           not null, primary key
#  announcement_item_type :string(255)      not null
#  description            :text(65535)      not null
#  destroyed_at           :integer          default(-1), not null
#  email_delivery_status  :integer          default("undelivered"), not null
#  for_official_user      :boolean          default(TRUE), not null
#  for_temp_user          :boolean          default(TRUE), not null
#  published_at           :datetime
#  push_delivery_status   :integer          default("undelivered"), not null
#  title                  :string(255)      not null
#  use_email              :boolean          default(FALSE), not null
#  use_push               :boolean          default(FALSE), not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  announcement_item_id   :bigint           not null
#
# Indexes
#
#  index_announcements_on_announcement_item  (announcement_item_type,announcement_item_id)
#  index_announcements_on_destroyed_at       (destroyed_at)
#
class Announcement < ApplicationRecord
  include KikanSoftDestroyable

  ANNOUNCEMENT_TYPE = %w[
    AccountServiceAnnouncement
    CouponAnnouncement
    CampaignAnnouncement
    ReservationAnnouncement
  ].freeze
  GUIDANCE_TYPE = %w[AccountServiceGuidance OwnedVehicleGuidance PurchaseHistoryGuidance MaintenanceHistoryGuidance].freeze
  DELEGATED_TYPE = (ANNOUNCEMENT_TYPE + GUIDANCE_TYPE ).freeze
  delegated_type :announcement_item,
    types:     DELEGATED_TYPE,
    dependent: :destroy

  has_many :recipients, class_name: 'AnnouncementRecipient', dependent: :destroy

  validates :title, presence: true
  validates :description, presence: true
  validates :announcement_item, presence: true

  enum email_delivery_status: { undelivered: 0, delivering: 1, delivered: 2 }, _prefix: true
  enum push_delivery_status: { undelivered: 0, delivering: 1, delivered: 2 }, _prefix: true

  delegate :target_users, :email_recipients, :send_email_user_ids, :push_recipients, :send_push_user_ids, to: :announcement_item

  scope :order_recent_published, -> { order(published_at: :desc) }
  scope :within_terms, -> { where(published_at: 1.years.ago..) }
  scope :read, -> { includes(:recipients).where.not(recipients: { read_at: nil }) }
  scope :unread, -> { includes(:recipients).where(recipients: { read_at: nil }) }
  scope :only_announcement_type, -> { where(announcement_item_type: ANNOUNCEMENT_TYPE) }
  scope :with_out_reservation, -> { where.not(announcement_item_type: 'ReservationAnnouncement') }

  def mail_subject
    title
  end

  def coupon?
    announcement_item_type == 'CouponAnnouncement'
  end

  def campaign?
    announcement_item_type == 'CampaignAnnouncement'
  end

  def publish!
    AnnouncementDeliveryJob.perform_later(self.id)
    update!(published_at: Time.current)
  end

  def published?
    published_at.present?
  end

  def create_recipients!(zas_user_ids)
    target_zas_user_ids = zas_user_ids - recipients.pluck(:zas_user_id)
    return if target_zas_user_ids.blank?

    current_time = Time.current

    target_zas_user_ids.map { |id| { zas_user_id: id } }.each_slice(5_000) do |attribute|
      recipients.create_with(created_at: current_time, updated_at: current_time).insert_all!(attribute)
    end
  end

  def mypage_site_url
    "#{ENV['SERVICE_URL']}/announcements/#{id}"
  end
end
```

```Ruby
# == Schema Information
#
# Table name: campaign_announcements
#
#  id          :bigint           not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  campaign_id :bigint           not null
#
# Indexes
#
#  index_campaign_announcements_on_campaign_id  (campaign_id)
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#
class CampaignAnnouncement < ApplicationRecord
  include AnnouncementItem

  belongs_to :campaign
  has_many :campaign_announcement_shops, dependent: :destroy

  def target_users
    shop_ids = campaign_announcement_shops.pluck(:shop_id)
    registration_statuses = []
    registration_statuses << ZasUser.registration_statuses[:official] if announcement.for_official_user?
    registration_statuses << ZasUser.registration_statuses[:temporary] if announcement.for_temp_user?

    if shop_ids.empty?
      ZasUser.where(registration_status: registration_statuses)
    else
      ZasUser.joins(:favorite_shops).where(favorite_shops: { shop_id: shop_ids }).where(registration_status: registration_statuses)
    end
  end

  private

  def notification_email_column_name
    :campaign_by_email
  end

  def notification_push_column_name
    :campaign_by_push
  end
end
```