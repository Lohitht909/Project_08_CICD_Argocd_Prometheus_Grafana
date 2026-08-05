pipeline {
    agent any

    stages {
    stage('Checkout Code') {
        steps {
            echo 'scm git'
            git branch: 'main', url: 'https://github.com/Lohitht909/Project_08_CICD_Argocd_Prometheus_Grafana.git'
        }
    }
    

    stage('SonarQube Analysis') {
        steps {
            withSonarQubeEnv('SonarQube') {   // Jenkins -> Manage Jenkins -> Configure System -> SonarQube servers
                 script {
                   def scannerHome = tool 'SonarScannerCLI'   // Jenkins -> Manage Jenkins -> Tools -> SonarQube Scanner installations
                      sh """
                          ${scannerHome}/bin/sonar-scanner \
                          -Dsonar.projectKey=my-devops-app \
                          -Dsonar.sources=. \
                          -Dsonar.host.url=http://100.54.204.15:9000/ \
                          -Dsonar.login=squ_7e10d062a797fc090c45adcb4ac4ebbb4870ef33
                       """
                    }
                }
            }
        }

    stage('Building the code') {
      steps {
        sh 'ls -ltr'
        // build the project and create a JAR file
        sh 'npm install'
      }
    }

    stage('Build docker image'){
    steps{
        script{
            echo 'docker image build'
        sh 'sudo docker build -t lohith0720/nodejs:${BUILD_NUMBER} .'
        }
    }
}
		
     stage('docker image scan'){
     steps{
         sh "sudo trivy image lohith0720/nodejs:${BUILD_NUMBER}"
     }
 }		


stage('Push image to ECR') {
    steps {
        withAWS(credentials: 'aws-creds', region: 'us-east-1') {
            script {
                sh '''
                  aws ecr get-login-password --region us-east-1 \
                  | sudo docker login --username AWS --password-stdin 483176634994.dkr.ecr.us-east-1.amazonaws.com
                  
                  sudo docker tag lohith0720/nodejs:${BUILD_NUMBER} 483176634994.dkr.ecr.us-east-1.amazonaws.com/nodejs:${BUILD_NUMBER}
                  sudo docker push 483176634994.dkr.ecr.us-east-1.amazonaws.com/nodejs:${BUILD_NUMBER}
                '''
            }
        }
    }
}
       stage('Update Deployment File') {
		
		 environment {
            GIT_REPO_NAME = "Project_8"
            GIT_USER_NAME = "lohitht909"
        }
		
            steps {
                echo 'Update Deployment File'
				withCredentials([string(credentialsId: 'githubtoken', variable: 'githubtoken')]) 
				{
                  sh '''
                    git config user.email "lohithtallapudi909@gmail.com"
                    git config user.name "lohitht909"
                    BUILD_NUMBER=${BUILD_NUMBER}
                   #sed -i "s/mc:.*/mc:${BUILD_NUMBER}/g" deploymentfiles/deployment.yml
					sed -i "s|image: .*|image: 483176634994.dkr.ecr.us-east-1.amazonaws.com/nodejs:$BUILD_NUMBER|" deploymentfiles/deployment.yml
                    git add .
                    
                    git commit -m "Update deployment image to version ${BUILD_NUMBER}"

                    git push https://${githubtoken}@github.com/${GIT_USER_NAME}/${GIT_REPO_NAME} HEAD:main
                '''
				  
                 }
				
            }
        }

  }
}
