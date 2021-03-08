import { Model as BaseModel } from 'vue-api-query'
import request from '@/utils/request'

export default class Model extends BaseModel {

  // Define a base url for a REST API
  baseURL() {
    return 'http://local.kamefiber.com'
  }
  // Implement a default request method
  request(config) {
    return request(config)
  }
}