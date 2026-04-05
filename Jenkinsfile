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
    - sleep
    args:
    - "9999999"
    tty: true
    volumeMounts:
    - name: docker-config
      mountPath: /kaniko/.docker
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
            --context=dir://$PWD/backend \
            --destination=$DOCKERHUB/backend:$IMAGE_TAG
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
            --context=dir://$PWD/frontend \
            --destination=$DOCKERHUB/frontend:$IMAGE_TAG
          '''
        }
      }
    }

    stage('Deploy') {
      steps {
        sh '''
        kubectl set image deployment/backend backend=$DOCKERHUB/backend:$IMAGE_TAG
        kubectl set image deployment/frontend frontend=$DOCKERHUB/frontend:$IMAGE_TAG
        '''
      }
    }
  }
}
