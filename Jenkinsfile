pipeline {
    agent any

    options {
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Setup') {
            steps {
                nodejs(nodeJSInstallationName: '14') {
                    sh '''
                        npm install -g pnpm
                    '''
                }
            }
        }

        stage('Test') {
            steps {
                nodejs(nodeJSInstallationName: '14') {
                    sh '''
                        cd backend
                        pnpm i
                        pnpm test:unit

                        # esses testes precisam do docker rodando para funcionar
                        # no futuro vamos adicionar ele no agent do jenkins
                        #docker-compose up -d
                        #pnpm test:integration
                        #pnpm test:e2e
                        #docker-compose down
                    '''
                }
            }
        }

        stage('Build backend') {
            steps {
                nodejs(nodeJSInstallationName: '14') {
                    sh '''
                        cd backend
                        pnpm install
                        pnpx tsc
                    '''
                }
            }
        }

        stage('Build frontend') {
            steps {
                nodejs(nodeJSInstallationName: '14') {
                    sh '''
                        cd frontend
                        pnpm install
                        pnpm run build
                    '''
                }
            }
        }
    }
}
/* vim: set ft=groovy: */
