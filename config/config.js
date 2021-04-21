module.exports = {
    server: {
            host: 'localhost',
            port: 3001
    },
    database: {
        host: '127.0.0.1',
        port: 27017,
        db: 'smap',
        url:'mongodb://localhost/cov-belu',
        //url:'mongodb://cov19admin:cov19AdminSampang@103.146.132.203:27017/admin',
        //url:'mongodb://103.146.132.203:27017/cov-sampang',
        username:'covid19',
        password:'covid19ssS'
    },
    token:{
        secret:'47287e41e0cb0d376e5b5b392581acaf66b8f7aa82dd513137d2e15b856b82cfbe5701ccc6fe275ac24c53a157ae6b331a8dde34198c76c50d4c40d65b99e91f'
    },
    mqtt:{ 
        host: 'localhost', 
        port: 4001 
    },
    key: {
        privateKey: 'NiAnRoQlUzD_rAdNaKsI_dAmMaHuM',
        tokenExpiry: Math.floor(Date.now() / 1000) + (60 * 60) //1 hour
    },
    email: {
        username: "ypanduman@gmail.com",
        password: "P@nduman1",
        verifyEmailUrl: "verify-email",
        resetEmailUrl: "reset",
        smtpHost: "smtp.gmail.com",
        smtpPort: 587,
        smtpSecure: false
    },
    role:{
        admin: "ADMIN",
        gugus_tugas: "GUGUS TUGAS",
        user: "USER"
    },
    base_response :{
        is_success: false,
        description: "error",
        data: null,
        token: null
    },
    errors:{
        unauthorized: "You are not unauthorized"
    },
};
