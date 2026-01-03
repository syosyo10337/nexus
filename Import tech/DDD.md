 

# DDD

ざっくり

**A. Handler層 (Goaサービスの実装)community_event_program.go**

**クエストの実際の流れ**

1. **design/svc_community_event_program.go** → API仕様定義

2. **goa gen** → コード生成

3. **HTTP Request** → 実際の処理開始

実際のリクエストは以下の経路を辿ります：

**A. HTTP層**

```Go
// server.go   
 CreateCommunityEventProgram: NewCreateCommunityEventProgramHandler(e.CreateCommunityEventProgram, mux, decoder, encoder, errhandler, formatter),    UpdateCommunityEventProgram: NewUpdateCommunityEventProgramHandler(e.UpdateCommunityEventProgram, mux, decoder, encoder, errhandler, formatter),    DeleteCommunityEventProgram: NewDeleteCommunityEventProgramHandler(e.DeleteCommunityEventProgram, mux, decoder, encoder, errhandler, formatter),    ListCommunityEventPrograms:  NewListCommunityEventProgramsHandler(e.ListCommunityEventPrograms, mux, decoder, encoder, errhandler, formatter),
```

**B. Endpoint層**

```Go
// endpoints.go
func NewCreateCommunityEventProgramEndpoint(s Service) goa.Endpoint {  return func(ctx context.Context, req any) (any, error) {    p := req.(*CreateCommunityEventProgramPayload)    return s.CreateCommunityEventProgram(ctx, p)  }}
```

**C. Handler層 (実装開始点)**

```Go
// community_event_program.go

// CreateCommunityEventProgram 指定されたコミュニティイベントに新しいプログラムを作成します
func (s *communityEventProgramService) CreateCommunityEventProgram(ctx context.Context, p *communityeventprogramservice.CreateCommunityEventProgramPayload) (*communityeventprogramservice.CreateCommunityEventProgramResult, error) {  // TenantID を uint64 へパースする  // NOTE: この処理の前に､ goa がバリデーションするので､ エラーは無視して問題ない  tenantID, _ := helpers.ParseIDString(p.TenantID)  // CommunityEventIDをuint64に変換  communityEventID, err := helpers.ParseIDString(p.CommunityEventID)  if err != nil {    return nil, communityeventprogramservice.MakeBadRequest(errors.Wrap(err, "invalid community event ID format"))  }  // Payload → Usecase入力への変換  input := usecase.CreateProgramInput{    CommunityEventID: communityEventID,    Name:             p.Name,    Description:      p.Description,  }  program, err := s.usecase.CreateProgram(ctx, tenantID, input)  if err != nil {    return nil, s.handleError(err)  }  return &communityeventprogramservice.CreateCommunityEventProgramResult{    ProgramID: helpers.FormatIDString(program.ID),  }, nil}
```

**D. Usecase層への委譲**

Handler はUsecaseを呼び出し、ビジネスロジックを実行します。

**🔍 コードを追う実践的な手順**

1. **設計から開始**

- design/ フォルダでAPI仕様を確認

1. **Handler を特定**

- internal/handler/ で実際の実装を確認

- Goaの生成コードは読まずに、実装に集中

1. **Usecaseを追跡**

- internal/usecase/ でビジネスロジックを理解

1. **Domainを理解**

- internal/domain/model/ でエンティティとビジネスルール確認

視覚的なダイアグラムを作成する