/**
 * Created by chengfei on 2017/2/21.
 */
module.exports = {
    api: '/api/mock/home',
    response: function (req, res) {
        res.json({
            success: true,
            code: 0,
            data: {
                name: '成飞',
            }
        })
    }
}
