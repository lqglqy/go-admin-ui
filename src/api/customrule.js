import request from '@/utils/request'

// 查询CustomRule列表
export function listCustomRule(query) {
    return request({
        url: '/api/v1/customrule',
        method: 'get',
        params: query
    })
}

// 查询CustomRule详细
export function getCustomRule (id) {
    return request({
        url: '/api/v1/customrule/' + id,
        method: 'get'
    })
}


// 新增CustomRule
export function addCustomRule(data) {
    return request({
        url: '/api/v1/customrule',
        method: 'post',
        data: data
    })
}

// 修改CustomRule
export function updateCustomRule(data) {
    return request({
        url: '/api/v1/customrule/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除CustomRule
export function delCustomRule(data) {
    return request({
        url: '/api/v1/customrule',
        method: 'delete',
        data: data
    })
}

