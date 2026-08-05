pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                echo 'Checking out source code'
                git branch: 'main', url: 'https://github.com/Lohitht909/Project_08_CICD_Argocd_Prometheus_Grafana.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    script {
                        def scannerHome = tool 'SonarScannerCLI'
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=my-devops-app \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=http://100.54.204.15:9000 \
                            -Dsonar.login=squ_7e10d062a797fc090c45adcb4ac4ebbb4870ef33
                        """
                    }
                }
            }
        }

        stage('Building the Code') {
            steps {
                sh 'ls -ltr'
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building Docker Image'
                    sh """
                        docker build -t lohith0720/nodejs:${BUILD_NUMBER} .
                    """
                }
            }
        }

        stage('Docker Image Scan') {
            steps {
                sh """
                    trivy image lohith0720/nodejs:${BUILD_NUMBER}
                """
            }
        }

        stage('Push Image to ECR') {
            steps {
                withAWS(credentials: 'aws-creds', region: 'us-east-1') {
                    sh """
                        aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 483176634994.dkr.ecr.us-east-1.amazonaws.com

                        docker tag lohith0720/nodejs:${BUILD_NUMBER} 483176634994.dkr.ecr.us-east-1.amazonaws.com/nodejs:${BUILD_NUMBER}

                        docker push 483176634994.dkr.ecr.us-east-1.amazonaws.com/nodejs:${BUILD_NUMBER}
                    """
                }
            }
        }

        stage('Update Deployment File') {

            environment {
                GIT_REPO_NAME = "Project_08_CICD_Argocd_Prometheus_Grafana"
                GIT_USER_NAME = "Lohitht909"
            }

            steps {
                echo 'Updating Deployment File'

                withCredentials([string(credentialsId: 'githubtoken', variable: 'githubtoken')]) {

                    sh """
                        git config user.email "lohithtallapudi909@gmail.com"
                        git config user.name "lohitht909"

                        sed -i "s|image: .*|image: 483176634994.dkr.ecr.us-east-1.amazonaws.com/nodejs:${BUILD_NUMBER}|" deploymentfiles/deployment.yml

                        git add deploymentfiles/deployment.yml

                        git commit -m "Update deployment image to version ${BUILD_NUMBER}" || true

                        git push https://${githubtoken}@github.com/${GIT_USER_NAME}/${GIT_REPO_NAME}.git HEAD:main
                    """
                }
            }
        }
    }
}
