import { ADD_ARTICLE } from '../constants/action-types'
import { ADD_TACOS } from '../constants/action-types'

const initialState = {
    articles: [],
    tacos:["bacon","veggie","chewie"]
  };
  
  function rootReducer(state = initialState, action) {
    if(action.type === ADD_ARTICLE){
      return Object.assign({}, state, {articles: state.articles.concat(action.payload)
    })  
    }

    if(action.type === ADD_TACOS){
      return Object.assign({}, state, {tacos: state.tacos.concat(action.payload)
      })  
    }


    return state;
  };
  
export default rootReducer;