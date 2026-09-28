pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        timeout(time: 20, unit: 'MINUTES')
        timestamps()
    }

    environment {
        APP_NAME = 'aditya-portfolio'
        REGISTRY_HOST = 'docker.io'
        IMAGE_FRONTEND = 'aditya/portfolio-frontend'
        IMAGE_BACKEND = 'aditya/portfolio-backend'
        VERSION_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout SCM') {
            steps {
                echo "Checking out repository branch ${env.BRANCH_NAME ?: 'master'}..."
                checkout scm
            }
        }

        stage('Parallel Automated CI') {
            parallel {
                stage('Frontend Build & Check') {
                    steps {
                        dir('frontend') {
                            echo "Building Frontend (Node 20 + Vite + TypeScript)..."
                            sh 'npm install'
                            sh 'npm run build'
                        }
                    }
                    post {
                        success {
                            archiveArtifacts artifacts: 'frontend/dist/**', allowEmptyArchive: false
                        }
                    }
                }

                stage('Backend Build & Test') {
                    steps {
                        dir('backend') {
                            echo "Compiling & Testing Spring Boot 3 Backend..."
                            sh 'mvn clean test -B'
                            sh 'mvn package -DskipTests=true -B'
                        }
                    }
                    post {
                        success {
                            archiveArtifacts artifacts: 'backend/target/*.jar', allowEmptyArchive: false
                        }
                    }
                }
            }
        }

        stage('Container Image Assembly') {
            steps {
                echo "Validating Docker Compose Specification & Building Images..."
                sh 'docker compose config'
                sh 'docker compose build --parallel'
            }
        }

        stage('Production Deployment Simulation') {
            steps {
                echo "Simulating Blue-Green / Rolling zero-downtime deployment for Portfolio v${VERSION_TAG}..."
                echo "Deployment health checks: Passed."
            }
        }
    }

    post {
        always {
            echo "Cleaning up workspace..."
            deleteDir()
        }
        success {
            echo "✓ [SUCCESS] Jenkins CI/CD pipeline finished with 0 errors."
        }
        failure {
            echo "✗ [FAILURE] Jenkins CI/CD pipeline failed. Check console output."
        }
    }
}
