define('SNB.renderTableTrHtml.js', [], function (require, exports, module) {  exports.generateTableTrHtml = function(i, quote){
    var trClass = i % 2 === 0 ? "gray" : "",
      tdClass = quote.percentage > 0 ? 'hot-colorup' : quote.percentage < 0 ? 'hot-colordown' : "",
      html = '<tr class="' + trClass + '">',
      symbol = quote.symbol || quote.code;

    if ( quote.isTP ) {
      quote.isMF = true;
    }  
    
    if ( symbol ) {
      html += '<td><a href="http://xueqiu.com/S/' + symbol + '" target="_blank" title="' + quote.name + '">' + quote.name + '</a>';
    } else {
      html += quote.name;
    }

    var digits = 2;
    if ( quote.isMF ) {
      digits = 4;
    }
    if ( quote.isPF ) {
      digits = 4;
    }

    var current = quote.current,
      change,percentage,percentageStr;

    if ( !quote.isFP ) {
      current = (_.isUndefined(quote.current) || _.isNull(quote.current)) ? "-" : parseFloat(quote.current).toFixed(digits);
    }

    html += '<td class="' + tdClass + '">' + current + '</td>';  

    if ( quote.change ) {
      if ( quote.isMF ) {
        digits = 3;
        if ( quote.isTP ) {
          digits = 4;
        }
      }

      if (quote.isPF) {
        change = SNB.Util.decimal_2(quote.change); 
      } else {
        change = quote.change ? parseFloat(quote.change).toFixed(digits) : "";
      }
    }

    if ( !_.isUndefined(quote.percentage) ) {
      if ( quote.isTP ) {
        quote.percentage *= 100;
      }
      if ( quote.isMF ) {
        digits = 3;
        if ( quote.isTP ) {
          digits = 2;
        }
      }
      percentageStr = _.isUndefined(quote.percentage) ? "-" : parseFloat(quote.percentage).toFixed(digits);
      percentage = quote.percentage > 0 ? ('+' + percentageStr) : percentageStr;
    }

    if ( percentage && percentage != "-" ) {
      percentage += "%";
    }

    if ( quote.isTP ) {
      change = "";
      percentage = percentage || "-";
    }

    if ( change ) {
      html += '<td class="' + tdClass + '">' + change + '</td>';  
    } else {
      if ( quote.isPF ) {
        html += '<td class="' + tdClass + '">-</td>';  
      }
    }

    if ( percentage ) {
      html += '<td class="' + tdClass + '">' + percentage + '</td>';  
    }
    return html;
  };
});
