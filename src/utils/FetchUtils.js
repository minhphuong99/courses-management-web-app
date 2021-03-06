import config from './../config';

class FetchAPI {
  constructor() {
    this.timeout = config.timeout;
    this.uri = config.rootapi;
  }

  getHeader(isUpload) {
    const accessToken = localStorage.getItem('accessToken');
    let headers = {}
    if(!isUpload) headers['Content-Type'] = 'application/json'
    if (accessToken) headers.Authorization = "Bearer " + accessToken;
    return headers;
  }

  getFetchParams(path, method, query, body, isUpload) {
    let fullPath = path[0] === '/' ? `${this.uri}${path}` : `${this.uri}/${path}`
    if (query) {
      fullPath = fullPath + query;
    }
    let config = {
      method: method,
      headers: this.getHeader(isUpload),
      body: isUpload ? body : JSON.stringify(body),
    }
    return {
      endpoint: fullPath,
      config: config
    }
  }

  async fetchApiWithTimeout(path, method, query, body, isUpload) {
    let fetchParams = this.getFetchParams(path, method, query, body, isUpload);
    try {
      let response = await Promise.race([
        fetch(fetchParams.endpoint, fetchParams.config),
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({ name: "timeout" })
          }, this.timeout);
        })
      ])
      if (response.name === "timeout") {
        return response;
      }
      if (response.status === 401) {
        localStorage.clear();
      }
      return response
    } catch (error) {
      return { error }
    }
  }
}

class FetchUtils {
  constructor() {
    this.fetchAPI = new FetchAPI();
  }
  async get(path, query) {
    let response = await this.fetchAPI.fetchApiWithTimeout(path, 'GET', query);
    let result = await response.json();
    result.status = response.status;
    return result;
  }
  async post(path, body, isUpload) {
    let response =  await this.fetchAPI.fetchApiWithTimeout(path, 'POST', null, body, isUpload);
    let result = await response.json();
    result.status = response.status;
    return result;
  }
  async patch(path, body) {
    let response =  await this.fetchAPI.fetchApiWithTimeout(path, 'PATCH', null, body);
    let result = await response.json();
    result.status = response.status;
    return result;
  }
  async delete(path, body) {
    let response =  await this.fetchAPI.fetchApiWithTimeout(path, 'DELETE', null, body);
    let result = await response.json();
    result.status = response.status;
    return result;
  }
  async downloadFile(path, query) {
    return await this.fetchAPI.fetchApiWithTimeout(path, 'GET', query);
  }
}

let instance = new FetchUtils();
Object.freeze(instance);

export default instance;