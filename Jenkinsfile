pipeline {
    agent any

    tools {
        jdk 'Java21'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/shaaroni/8.2CDevSecOps.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Run Tests') {
            steps {
                withCredentials([
                    string(credentialsId: 'SNYK_TOKEN', variable: 'SNYK_TOKEN')
                ]) {
                    bat 'snyk test --auth-token=%SNYK_TOKEN% || exit /b 0'
                }
            }
        }

        stage('Generate Coverage Report') {
            steps {
                bat 'npm run coverage || exit /b 0'
            }
        }

        stage('NPM Audit (Security Scan)') {
            steps {
                bat 'npm audit || exit /b 0'
            }
        }

        stage('SonarCloud Analysis') {
            steps {
                withCredentials([
                    string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')
                ]) {
                    bat '''
                        if exist sonar-scanner.zip del /F /Q sonar-scanner.zip
                        if exist sonar-scanner-7.3.0.5189-windows-x64 rmdir /S /Q sonar-scanner-7.3.0.5189-windows-x64

                        curl -L -o sonar-scanner.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-7.3.0.5189-windows-x64.zip

                        powershell -Command "Expand-Archive -Path sonar-scanner.zip -DestinationPath . -Force"

                        sonar-scanner-7.3.0.5189-windows-x64\\bin\\sonar-scanner.bat ^
                            -Dsonar.projectKey=shaaroni_8.2CDevSecOps ^
                            -Dsonar.organization=shaaroni ^
                            -Dsonar.host.url=https://sonarcloud.io ^
                            -Dsonar.token=%SONAR_TOKEN%
                    '''
                }
            }
        }
    }
}
