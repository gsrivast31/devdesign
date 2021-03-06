Template[getTemplate('postDomain')].helpers({
  /*domain: function(){
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  }*/
  postLink: function(){
    return !!this.url ? getOutgoingUrl(this.url) : '';
  },
  postTarget: function() {
    return !!this.url ? '_blank' : '';
  }

});