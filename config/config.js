module.exports = {
    server: {
            host: 'localhost',
            port: 3001
    },
    database: {
        host: '127.0.0.1',
        port: 27017,
        db: 'smap',
        //url: 'mongodb:/127.0.0.1:27017/semar'
        url:'mongodb://localhost/cov-sampang'
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
    }
};
