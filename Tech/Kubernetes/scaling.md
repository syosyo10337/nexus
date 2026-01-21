---
tags:
  - kubernetes
  - k8s
  - scaling
created: 2026-01-20
status: active
---

# Scalingについて

Scalingは、Podの数を増やすことを意味します。

## Podの数をScalingする基本的なコマンド

```bash
k scale deployment <deployment-name> --replicas=<number>
```

## Horizontal Pod Autoscaler(HPA)

Horizontal Pod Autoscaler(HPA)は、Podの数を自動でスケールするためのコントローラーです。
通常は,
CPUやメモリの値に応じてPodを増減しますが、任意のメトリクスを利用して対応することも可能です。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hpa-handson
  labels:
    app: hello-server
spec:
  selector:
    matchLabels:
      app: hello-server
  template:
    metadata:
      labels:
        app: hello-server
    spec:
      containers:
      - name: hello-server
        image: blux2/hello-server:1.8
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "10Mi"
            cpu: "5m"
          limits:
            memory: "10Mi"
            cpu: "5m"
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: hello-server-hpa
spec:
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - resource:
      name: cpu
      target:
        averageUtilization: 50
        type: Utilization
    type: Resource
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: hpa-handson
---
apiVersion: v1
kind: Service
metadata:
  name: hello-server-service
spec:
  selector:
    app: hello-server
  ports:
    - protocol: TCP
      port: 8080
      targetPort: 8080

```

CPUの使用率に応じて、podの数を増やします。ただスケールには時間がかかるので急なスパイクには対応できません。

## Vertical Pod Autoscaler(VPA)

Vertical Pod Autoscaler(VPA)は、垂直スケーリングを行うためのK8sのコントローラーです。
自動で、Resource RequestとResource Limitの値を変更できます。
ただし、HPAとの併用はできないため、HPAが優先されて利用されることが多い。

## 参考

- [Tech/CS/Vertical and Horizontal Scaling.md](/Tech/CS/Vertical%20and%20Horizontal%20Scaling.md)
