/**
 * @author Varun Kumar
 * Date: 21st April, 2018
 */

const insurers = require('../data/insurer.json');
const tpas = require('../data/tpa.json');

// return form-name.html from views/forms based on mapping logic
module.exports = function(insurerId, tpaId) {
	insurerId = parseInt(insurerId);
	tpaId = parseInt(tpaId);

    let formName = 'irda';
    switch(insurerId) {
    	case 1: {
    		formName = 'apollo-munich';
    		break;
    	}

    	case 2: {
    		formName = 'bajaj-allianz';
    		break;
    	}

    	case 3: {
    		formName = 'bharti-axa';
    		break;
    	}

    	case 7: {
    		formName = 'hdfc-ergo';
    		break;
    	}

    	case 19: {
    		formName = 'royal-sundaram';
    		break;
    	}

    	case 22: {
    		formName = 'star-health';
    		break;
    	}

    	case 27: {
    		formName = 'aditya-birla';
    		break;
    	}
    }

    // tpa will override insurer form
    switch(tpaId) {
    	case 1: {
    		formName = 'united-healthcare';
    		break;
    	}

    	case 2: {
    		formName = 'medi-assist';
    		break;
    	}

    	case 5: {
    		formName = 'e-meditek-insurance';
    		break;
    	}

    	case 14: {
    		formName = 'medsave-health';
    		break;
    	}

    	case 19: {
    		formName = 'vipul-medcorp';
    		break;
    	}
    }

    return formName;
}