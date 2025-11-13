export const URL = {
// baseUrl :   'http://192.168.1.5:9080',
baseUrl :   'http://127.0.0.1:9080',
login : '/v1/auth/login',
role : '/v1/users/roles',
users : '/v1/users',
motorsIn : '/v1/motors?status=In',
motorsInPost : '/v1/motors/in',

motorsTrail : '/v1/motors?status=Trial',
motorsOverhauling : '/v1/motors?status=Overhauling',
motorsFault : '/v1/motors?status=Fault',
motorsOut : '/v1/motors?status=Out',
motorsAvailable : '/v1/motors?status=Available',
motorsOutPatch: '/v1/motors/:motor_id/move-to-out',
motorsAll : '/v1/motors',
motorDashobard : 'v1/motors/analytics'
}