const isEmpty = (obj)=> {
    if (typeof obj == 'number' || typeof obj == 'boolean') {
      return false;
    }

    if (obj == "") {
      return true;
    }

    for (var x in obj) {
      return false;
    }

    return true;
  }


  module.exports = {
      isEmpty
  }