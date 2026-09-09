pipeline { 
  agent any 
  tools {
    jdk 'Java21'
  }
  stages { 
    stage('Checkout') { 
      steps { 
        git branch: 'main', url: 'https://github.com/shaaroni/8.2CDevSecOps.git' 
      } 
    } 
 
    stage('Install Dependencies') { 
      steps { 
        bat 'npm ci' 
      } 
    } 
 
    stage('Run Tests') { 
      steps { 
        withCredentials([string(credentialsId: 'SNYK_TOKEN', variable: 'SNYK_TOKEN')]) {
          bat "snyk auth %SNYK_TOKEN%"
          bat 'npm test || exit 0' // Allows pipeline to continue despite test failures 
        }
      } 
    } 
 
    stage('Generate Coverage Report') { 
      steps { 
        bat 'npm run coverage || exit 0' 
      } 
    } 
 
    stage('NPM Audit (Security Scan)') { 
      steps { 
        bat 'npm audit || exit 0' 
      } 
    } 

    stage('SonarCloud Analysis') {
      steps {
        withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')]) {
          bat '''
            curl -L -o sonar-scanner.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-windows.zip
            powershell -Command "Expand-Archive sonar-scanner.zip -DestinationPath ."
            .\\sonar-scanner-5.0.1.3006-windows\\bin\\sonar-scanner ^
              -Dsonar.projectKey=shaaroni_8.2CDevSecOps ^
              -Dsonar.organization=shaaroni ^
              -Dsonar.host.url=https://sonarcloud.io ^
              -Dsonar.login=%SONAR_TOKEN%
          '''
        }
      }
    }
  } 
}

