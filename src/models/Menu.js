import Model from './Model'

export default class Menu extends Model {
  // Set the resource route of the model
  resource() {
    return 'api/cms/menu'
  }
}