import request from '@/utils/request'

// 查询Custom列表
export function listCustom(query) {
    return request({
        url: '/api/v1/custom',
        method: 'get',
        params: query
    })
}

// 查询Custom详细
export function getCustom (id) {
    return request({
        url: '/api/v1/custom/' + id,
        method: 'get'
    })
}


// 新增Custom
export function addCustom(data) {
    console.log(data)
    return request({
        url: '/api/v1/custom',
        method: 'post',
        data: data
    })
}

// 修改Custom
export function updateCustom(data) {
    return request({
        url: '/api/v1/custom/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除Custom
export function delCustom(data) {
    return request({
        url: '/api/v1/custom',
        method: 'delete',
        data: data
    })
}

