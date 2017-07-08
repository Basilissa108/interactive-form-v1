// sVariable = string, aVariable = array, jVariable = json

// DESIGN 
const aAllColors = $("#color").children();
let aColorsThemeOne = [];
let aColorsThemeTwo = [];

// ACTIVITIES
let aAllActivities = $(".activities").children("label");
let aActivityInput = $(".activities").children("label").children("input");
let aSortedActivities = [];

// PAYMENT
const aAllPaymentOptionsInfo = [$("#credit-card"), $("#paypal"), $("#bitcoin")];

// ERRORS
const sValidationErrorName = '<span id="validation-error-name" style="color:red; float:right;">Please enter your name, it is required.</span>';
const sValidationErrorMail = '<span id="validation-error-mail" style="color:red; float:right;">Please enter a valid mail address, it is required.</span>';
const sValidationErrorActivities = '<span id="validation-error-activities" style="color:red">Please select at least one activity.</span>';
const sValidationErrorCcNum = '<span id="validation-error-cc-num" style="color:red; display:block; width: 100%">Enter a credit number with 13 - 16 digits.</span>';
const sValidationErrorZip = '<span id="validation-error-zip" style="color:red; display:block">Enter a zip code with 5 digits.</span>';
const sValidationErrorCvv = '<span id="validation-error-cvv" style="color:red; display:block">Enter a CVV with 3 digits.</span>';
/**********************************************************************************************************************/
/**********************************************************************************************************************/
/****************************************** FUNCTIONS - DESIGN ********************************************************/

// sort color options by theme
function fnSortColors(){
	// create a regex for each color theme
	const patternThemeOne = new RegExp("(JS Puns shirt only)");
	const patternThemeTwo = new RegExp("(I ♥ JS shirt only)");
	// loop through color options in array, push them to the array matching the theme using regex testing
	for(i = 0; i < aAllColors.length; i++){
		if(patternThemeOne.test(aAllColors[i].textContent)){
			aAllColors[i].textContent = aAllColors[i].textContent.replace("(JS Puns shirt only)", "");
			aColorsThemeOne.push(aAllColors[i]);
		}else if(patternThemeTwo.test(aAllColors[i].textContent)){
			aAllColors[i].textContent = aAllColors[i].textContent.replace("(I ♥ JS shirt only)", "");
			aColorsThemeTwo.push(aAllColors[i]);
		}
	}
}

// display color options based on selected theme
function fnDisplayTheme(themeArray){
	// reverse the array so the colors are in their original order
	themeArray.reverse();
	// loop through array and append each color
	for(i = 0; i < themeArray.length; i++){
		$("#color").append(themeArray[i]);
	}
}

/**********************************************************************************************************************/
/**********************************************************************************************************************/
/**************************************** FUNCTIONS - Activities ******************************************************/

// ACTIVITIES
function fnSortActivities(){
	for(i = 0; i < aAllActivities.length; i++){
		// create new json object
		let jActivity = {};
		// set key value pair for event name in json object
		jActivity.name = aActivityInput[i].name;
		// set time in json object
		if(aAllActivities[i].textContent.match(/\b((Tues|Wednes)(day)?)\b\s\d+((am)|(pm))\-\d+((am)|(pm))/g)){
		    jActivity.time = aAllActivities[i].textContent.match(/\b((Tues|Wednes)(day)?)\b\s\d+((am)|(pm))\-\d+((am)|(pm))/g).join(" ");   
		}
		// set price in json object
		jActivity.price = aAllActivities[i].textContent.match(/\$\d+/g).join(" ");
		// push the json object to the activities array
		aSortedActivities.push(jActivity);
	}
}

function fnCalculateTotal(activity, mathOperator){
    // get activity price
    let additionalPrice;
    // loop through all activities to find the one matching the passed argument; break when a match is found, no need to keep searching
    for(i = 0; i < aSortedActivities.length; i++){
        if(activity === aSortedActivities[i].name){
            additionalPrice    = parseInt(aSortedActivities[i].price.replace("$", ""));
           	fnDisableActivity(activity, aSortedActivities[i].time, mathOperator);
            break;
        }
    }
    // check if there is a price already or if it's the first selected activity, if a price exists add to the existing otherwise append price
    if($("#total-price").length === 0){
        const previousPrice = 0;
        const totalPrice = eval(previousPrice + mathOperator + additionalPrice);
        $(".activities").append('<span>Total: $<span id="total-price">' + totalPrice + '</span></span>');
    }else{
        const previousPrice = parseInt($("#total-price").text());
        const totalPrice = eval(previousPrice + mathOperator + additionalPrice);
        $("#total-price").text(totalPrice);
    }
}

function fnDisableActivity(activity, time, mathOperator){
    if(time !== undefined){
        for(i = 0; i < aSortedActivities.length; i++){
            if(aSortedActivities[i].time == time && aSortedActivities[i].name !== activity){
            	if(mathOperator == "+"){
	                $('input[name="'+aSortedActivities[i].name+'"]').attr("disabled", true);
	                $('input[name="'+aSortedActivities[i].name+'"]').parent().css("color", "grey");
	            }else if(mathOperator == "-"){
	            	$('input[name="'+aSortedActivities[i].name+'"]').attr("disabled", false);
	                $('input[name="'+aSortedActivities[i].name+'"]').parent().css("color", "");
	            }
            }
        }
    }
}

/**********************************************************************************************************************/
/**********************************************************************************************************************/
/****************************************** FUNCTIONS - PAYMENT *******************************************************/

// pass payment options that should be hidden to the function. it will loop over each element and set the display to none
function fnHidePaymentInfo(elementId){
	if(Array.isArray(elementId)){
		for(i = 0; i < elementId.length; i++){
			$(elementId[i]).css("display", "none");
		}
	}else{
		$(elementId).css("display", "none");
	}
}

/**********************************************************************************************************************/
/**********************************************************************************************************************/
/********************************************** VALIDATION ************************************************************/

// function to check mail format with regex
function fnIsMailValid(sMail) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // return true or false
    return regex.test(sMail);
}

// function to check if the input is valid, assuming the input has to be an integer with a min and max length; return true or false
function fnIsPaymentInfoValid(input, min, max){
	if(Number.isInteger(parseInt(input)) === false || input.length < min || input.length > max){
		return false;
	}else{
		return true;
	}
}



/**********************************************************************************************************************/
/**********************************************************************************************************************/
/************************************************ EVENTS **************************************************************/

// execute on load
window.addEventListener("DOMContentLoaded", function(){
    //hightlight first input field
	const oFirstInput = $("#name");
	oFirstInput.focus();
	// hide other title input
	$("#other-title").css("display", "none");
	// sort color options
	fnSortColors();
	// hide color label and select as by default no theme is chosen
	$('label[for="color"]').css("display", "none");
	$("#color").css("display", "none");
	// sort activities
	fnSortActivities();
	// hide all payment info
    fnHidePaymentInfo(aAllPaymentOptionsInfo);
	// select credit card payment by default
	$("#payment").find('[value="credit card"]').attr("selected", true);
	// display credit card info
	$("#credit-card").css("display", "");
	
})

// check if the name input field is empty, if it's no longer empty remove the error
$("#name").change(function(){
	if($(this).val().length !== 0){
		$(this).css("border", "");
		$("#validation-error-name").remove();
	}else{
		$(this).css("border", "1px solid red");
		$('label[for="name"]').prepend(sValidationErrorName);
	}
})

// when the mail input field changes, check if the input is in a valid mail format
$("#mail").change(function(){
	// pass the value of the mail input field to the function fnIsMailValid function - returns true or false, if it's false mark the field and display an message
    if(fnIsMailValid($(this).val()) === false){
    	$("#mail").css("border", "1px solid red");
    	if($("#validation-error-mail").length === 0){
    		$('label[for="mail"]').prepend(sValidationErrorMail);
    	}
    }else{
    	// in case the input was invalid before, remove the mark and message
    	$("#mail").css("border", "");
    	$("#validation-error-mail").remove();
    }
})

// display or hide other title input field on change, depending on whether the selected option is other or not
$("#title").change(function(){
	const sSelectedOption = $(this).val();
	const oParentFieldset = $(this).parent();
	// check if the option value equals other. if so append input field for other title, if not and the input field is still appended remove it
	if(sSelectedOption === "other"){
		$("#other-title").css("display", "");
	}else if(sSelectedOption !== "other" && $("#other-title").length !== 0){
		$("#other-title").css("display", "none");
	}
})

// display colors on change, pass the selected theme to the fnDisplay Theme function; if no theme is selected hide the color label and select
$("#design").change(function(){
	const sSelectedOption = $(this).val();
	$("#color").children().remove();
	if(sSelectedOption === "js puns"){
		$('label[for="color"]').css("display", "");
		$("#color").css("display", "");
		fnDisplayTheme(aColorsThemeOne);
	}else if(sSelectedOption === "heart js"){
		$('label[for="color"]').css("display", "");
		$("#color").css("display", "");
		fnDisplayTheme(aColorsThemeTwo);
	}else{
		$('label[for="color"]').css("display", "none");
		$("#color").css("display", "none");
	}
})

// display total price on change, pass the activity name and math operator based on whether the checkbox got checked or unchecked to the fnCalculateTotal function
$(".activities").change(function(e){
    const activity = $(e.target).attr("name");
    let mathOperator;
    // determine if activity was added or removed
    if($(e.target).is(":checked")){
        mathOperator = "+";
    }else if($(e.target).is(":checked") === false){
        mathOperator = "-";
    }
    // call fnCalculateTotal function and pass the selected activity and mathOperator to it
    fnCalculateTotal(activity, mathOperator);
    // check if any activities are checked and if there are, remove the error message (if it is displayed)
    if($("#validation-error-activities").length !== 0 && $("input:checked").length !== 0){
    	$("#validation-error-activities").remove();
    }
})

// get the selected payment option on change, pass the payment methods that should be hidden to the fnHidePaymentInfo function and remove display: none from the selected option
$("#payment").change(function(e){
	const sSelectedOption = e.target.value;
	if(sSelectedOption === "credit card"){
		fnHidePaymentInfo(aAllPaymentOptionsInfo);
		$("#credit-card").css("display", "");
	}else if(sSelectedOption === "paypal"){
		fnHidePaymentInfo(aAllPaymentOptionsInfo);
		$("#paypal").css("display", "");
	}else if(sSelectedOption === "bitcoin"){
		fnHidePaymentInfo(aAllPaymentOptionsInfo);
		$("#bitcoin").css("display", "");
	}else{
		fnHidePaymentInfo(aAllPaymentOptionsInfo);
	}
})

// on change check the input, if it's not an integer with 13 - 16 digits, mark it invalid and display a message
$("#cc-num").change(function(){
	const creditCard = $(this).val();
	const result = fnIsPaymentInfoValid(creditCard, 13, 16);
	if(result){
		// if input is valid remove error
		$("#cc-num").css("border", "");
		$("#validation-error-cc-num").remove();
	}else{
		$("#cc-num").css("border", "1px solid red");
		if($("#validation-error-cc-num").length === 0){
			$('#cc-num').parent().append(sValidationErrorCcNum);
		}
	}
})

// on change check the input, if it's not an integer with 5 digits, mark it invalid and display a message
$("#zip").change(function(){
	const zip = $(this).val();
	const result = fnIsPaymentInfoValid(zip, 5, 5);
	if(result){
		// if input is valid remove error
		$("#zip").css("border", "");
		$("#validation-error-zip").remove();
	}else{
		$("#zip").css("border", "1px solid red");
		if($("#validation-error-zip").length === 0){
			$('#zip').parent().append(sValidationErrorZip);
		}
	}
})

// on change check the input, if it's not an integer with 3 digits, mark it invalid and display a message
$("#cvv").change(function(){
	const cvv = $(this).val();
	const result = fnIsPaymentInfoValid(cvv, 3, 3);
	if(result){
		// if input is valid remove error
		$("#cvv").css("border", "");
		$("#validation-error-cvv").remove();
	}else{
		$("#cvv").css("border", "1px solid red");
		if($("#validation-error-cvv").length === 0){
			$('#cvv').parent().append(sValidationErrorCvv)
		}
	}
})

$("form").submit(function(e){
    e.preventDefault();
    // get the name input
    const sName = $("#name").val();
    // get the mail input
    const sMail = $("#mail").val();
    // get all checked activities
    const aCheckedActivities = $('input:checked');
    // check if a name was entered, if it was not mark the field and display message
	if(sName.length === 0){
    	$("#name").css("border", "1px solid red");
    	if($("#validation-error-name").length === 0){
    		$('label[for="name"]').prepend(sValidationErrorName);
    	}
    }else{
    	// in case the input was invalid before, remove the mark and message
    	$("#name").css("border", "");
    	$("#validation-error-name").remove();
    }
    // check if the mail address is empty, if it is display an error (no need to check further here as it will happen on change of the input)
    if(sMail.length === 0){
    	$("#mail").css("border", "1px solid red");
    	if($("#validation-error-mail").length === 0){
    		$('label[for="mail"]').prepend(sValidationErrorMail);
    	}
    }
    // check if at least one activity is checked, if not mark the field and display message
    if(aCheckedActivities.length === 0){
    	if($("#validation-error-activities").length === 0){
    		$(".activities").prepend(sValidationErrorActivities);
    	}
    }else{
    	// in case the input was invalid before, remove the message
    	$("#validation-error-activities").remove();
    }
    // submit form if the name input is not empty, there is no validation error for the mail address and at least one activity is checked
    if(sName.length !== 0 && $("#validation-error-mail").length === 0 && aCheckedActivities.length !== 0){
    	const selectedPaymentOption = $("#payment").val();
    	// if the selected payment option is not credit card, submit the form; if it is credit card check for validation errors, if there are no validation errors, submit the form
    	if(selectedPaymentOption !== "credit card"){
    		this.submit();
    	}else if(selectedPaymentOption === "credit card" && $("#validation-error-cc-num").length === 0 && $("#validation-error-zip").length === 0 && $("#validation-error-cvv").length === 0){
    		this.submit();
    	}
    }
})
