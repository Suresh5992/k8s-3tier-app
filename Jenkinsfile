pipeline {
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
spec:
  containers:

  - name: kaniko
    image: gcr.io/kaniko-project/executor:latest
    command:
      - /busybox/sh
      - -c
    args:
      - sleep 999999
    tty: true
    volumeMounts:
    - name: docker-config
      mountPath: /kaniko/.docker

  - name: kubectl
    image: bitnami/kubectl:latest
    command:
      - cat
    tty: true

  volumes:
  - name: docker-config
    projected:
      sources:
      - secret:
          name: dockerhub-secret
          items:
          - key: .dockerconfigjson
            path: config.json
"""
    }
  }

  environment {
    DOCKERHUB = "suresh628"
    IMAGE_TAG = "v${BUILD_NUMBER}"
  }

  stages {

    stage('Clone') {
      steps {
        git branch: 'main', url: 'https://github.com/Suresh5992/k8s-3tier-app.git'
      }
    }

    stage('Build Backend') {
      steps {
        container('kaniko') {
          sh '''
          /kaniko/executor \
            --dockerfile=backend/Dockerfile \
            --context=$PWD \
            --destination=$DOCKERHUB/backend:$IMAGE_TAG \
            --skip-tls-verify
          '''
        }
      }
    }

    stage('Build Frontend') {
      steps {
        container('kaniko') {
          sh '''
          /kaniko/executor \
            --dockerfile=frontend/Dockerfile \
            --context=$PWD \
            --destination=$DOCKERHUB/frontend:$IMAGE_TAG \
            --skip-tls-verify
          '''
        }
      }
    }

    stage('Deploy') {
      steps {
        container('kubectl') {
          sh '''
          kubectl apply -f manifestfiles/
          kubectl set image deployment/backend backend=$DOCKERHUB/backend:$IMAGE_TAG
          kubectl set image deployment/frontend frontend=$DOCKERHUB/frontend:$IMAGE_TAG
          '''
        }
      }
    }
  }
}
