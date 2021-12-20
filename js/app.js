function Validator(options) {
    var selectorRules = {};
    // Hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage;
        // Lấy ra cái rule của selecter 
        var rules = selectorRules[rule.selector];
        // Lặp qua từng rule và kiểm tra
        // Nếu có lỗi thì breack
        for (var i = 0; i < rules.length; ++i) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage)
                break;
        }
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        }
        else {
            errorElement.innerText = "";
            inputElement.parentElement.classList.remove('invalid');
        }
        return !errorMessage;
    }
    // lấy elemaent của form cần validate
    var formElement = document.querySelector(options.form);
    if (formElement) {
        // khi submit form
        formElement.onsubmit = function (e) {
            e.preventDefault();
            var isFormValid = true;
            // Thực hiện lặp qua từ rule và validate
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
                // Show hình ảnh xún dưới
                var img = document.querySelector('.img-ctl');
                var imgEnd = document.querySelector('.img-ctl.end');
                imgEnd.src = img.src;
            });
            if (isFormValid) {
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enableInputs).reduce(function (values, input) {
                        values[input.name] = input.value;
                        return values;
                    }, {});
                    options.onSubmit(formValues);
                }
                else {
                    formElement.submit();
                }
            }
        };
        // Lặp qua mỗi rule và xử lý
        options.rules.forEach(function (rule) {
            // Lưu lại cái rule cho mỗi in put 
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            }
            else {
                selectorRules[rule.selector] = [rule.test];
            }
            var inputElement = formElement.querySelector(rule.selector);
            if (inputElement) {
                // Xử lý khi blur ra ngoài input
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                };
                // Xử lý khi người dùng nhập vào input
                inputElement.oninput = function () {
                    console.log("ok");
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    // Full name viết hoa HC
                    document.getElementById('fullname').value = titleCase(document.getElementById('fullname').value); //nên cái value là của cái title nên nó k hiểu h bỏ sao
                    //  console.log(inputElement.value)
                    errorElement.innerText = "";
                    inputElement.parentElement.classList.remove('invalid');
                };
            }
        });
    }
}
//Định nghĩa các rule
// khi có lỗi thì trả về messgar lỗi
// khi không có lỗi thì không trả về gì ả undifile
Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : "Vui lòng nhập trường này";
        }
    };
};
Validator.isMaxLength = function (selector, length) {
    return {
        selector: selector,
        test: function (value) {
            if (value.trim().length <= length) {
                return undefined;
            }
            else {
                return "Tên quá dài";
            }
        }
    };
};
Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập đúng Email của bạn';
        }
    };
};
Validator.isPass = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            var regexPass = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
            return regexPass.test(value) ? undefined : 'Mật khẩu phải bao gồm chữ cái viết hoa, thường, số, ký tự đặt biệt';
        }
    };
};
Validator.confirmPass = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị không đúng';
        }
    };
};
Validator.isPhone = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            // xử lý số điện thoại không phải 10 số
            if (value.length === 10) {
                // xử lý số điện thoại phải bắt đầu bằng số 0
                if (value.startsWith(0)) {
                    return undefined;
                }
                else {
                    return 'Số điện thoại phải bắt đầu bằng số 0';
                }
            }
            else {
                return " Số điện thoại phải là 10 số";
            }
        }
    };
};
// 
// Xử lý viết hoa chữ cái đầu
function titleCase(text) {
    //1. Tách các từ, cụm từ trong chuỗi ban đầu
    var sentence = text.toLowerCase().split(" ");
    //2. Tạo vòng lặp và viết hoa chữ cái đầu tiên của các từ, cụm từ trên
    for (var i = 0; i < sentence.length; i++) {
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    //3. Nối các từ, cụm từ đã xử lý ở trên và trả về kết quả
    return sentence.join(" ");
}
//chỉ cho nhập số trong text sđt 
function isNumberKey(e) {
    var charCode = (e.which) ? e.which : e.keyCode;
    //Các phím được nhấn nằm trong khoảng từ 31 đên 48 và không lớn 57
    //Có nghĩa la cái phím được nhấn phải nằm trong khoảng từ 48 đến 57 (key code)
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}
//Reset
function reeset() {
    location.reload();
}
// Nhấn Shift để add
window.addEventListener('keydown', click);
function click(e) {
    if (e.keyCode == 16) {
        document.getElementById('submit').click();
    }
    // Nhấn delete để reset 
    if (e.keyCode == 46) {
        reeset();
    }
}
// Xử lý upload hình ảnh
window.addEventListener('load', function () {
    document.querySelector('input[type="file"]').addEventListener('change', function () {
        if (this.files && this.files[0]) {
            var img = document.querySelector('.img-ctl');
            img.onload = function () {
                URL.revokeObjectURL(img.src); // no longer needed, free memory
            };
            img.src = URL.createObjectURL(this.files[0]); // set src to blob url
            img = URL.createObjectURL(this.files[0]);
        }
    });
});
//Chọn vào hình ảnh để up load hình
var inputimgElement = document.querySelector('#inputimg');
function uploadAvt() {
    inputimgElement.click();
}
// Form - Validate
Validator({
    form: "#form-1",
    errorSelector: ".form-message",
    rules: [
        Validator.isRequired('#fullname'),
        Validator.isMaxLength('#fullname', 20),
        Validator.isRequired('#email'),
        Validator.isEmail('#email'),
        Validator.isRequired('#phone'),
        Validator.isPhone('#phone'),
        Validator.isRequired('#birthday'),
        Validator.isRequired('#password'),
        Validator.isPass('#password'),
        Validator.isRequired('#confirmpassword'),
        Validator.confirmPass('#confirmpassword', function () {
            return document.querySelector('#form-1 #password').value;
        }, 'Mật Khẩu nhập lại không đúng'),
    ],
    onSubmit: function (data) {
        var name = document.querySelector('#text-fullname');
        var email = document.querySelector('#text-email');
        var phone = document.querySelector('#text-phone');
        var birthday = document.querySelector('#text-birthday');
        name.innerHTML = data.fullName;
        email.innerHTML = data.email;
        phone.innerHTML = data.phone;
        birthday.innerHTML = data.birthday;
    }
});
