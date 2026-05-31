/**
 * Deploy portal request form (get-started.html)
 */
(function () {
  var FORM_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzQGL7Y3FhfaRD5LhN8KKaVqvBVNI0QGwdQI4I2S1CvkkO4ovrv5ZLEWGMQoFccFNKK/exec";

  function checkEmailExists(email) {
    return new Promise(function (resolve, reject) {
      var callbackName = "email_check_callback_" + Math.round(100000 * Math.random());
      var script = document.createElement("script");
      var url = new URL(FORM_SCRIPT_URL);
      url.searchParams.set("callback", callbackName);
      url.searchParams.set("action", "checkCompanyEmail");
      url.searchParams.set("email", email);

      window[callbackName] = function (data) {
        delete window[callbackName];
        if (script.parentNode) document.body.removeChild(script);
        resolve(data);
      };

      script.onerror = function () {
        delete window[callbackName];
        if (script.parentNode) document.body.removeChild(script);
        reject(new Error("Failed to check email"));
      };

      script.src = url.toString();
      document.body.appendChild(script);

      setTimeout(function () {
        if (window[callbackName]) {
          delete window[callbackName];
          if (script.parentNode) document.body.removeChild(script);
          reject(new Error("Email check timeout"));
        }
      }, 10000);
    });
  }

  function bindCheckboxAndRadioUI() {
    document.querySelectorAll(".checkbox-item input[type=\"checkbox\"]").forEach(function (checkbox) {
      var item = checkbox.closest(".checkbox-item");
      if (checkbox.checked) item.classList.add("checked");
      checkbox.addEventListener("change", function () {
        item.classList.toggle("checked", this.checked);
      });
    });

    document.querySelectorAll(".radio-item input[type=\"radio\"]").forEach(function (radio) {
      radio.addEventListener("change", function () {
        document.querySelectorAll("input[name=\"" + this.name + "\"]").forEach(function (r) {
          r.closest(".radio-item").classList.remove("selected");
        });
        if (this.checked) this.closest(".radio-item").classList.add("selected");
      });
    });
  }

  function applyStoredPricingSelection() {
    var userSelectField = document.getElementById("number_of_users");
    var subscriptionSelectField = document.getElementById("budget_range");
    if (!userSelectField || !subscriptionSelectField) return;

    var storedUsers = sessionStorage.getItem("selectedUsers");
    var storedSubscription = sessionStorage.getItem("selectedSubscription");
    if (storedUsers) userSelectField.value = storedUsers;
    if (storedSubscription) subscriptionSelectField.value = storedSubscription;

    var params = new URLSearchParams(window.location.search);
    if (params.get("users")) userSelectField.value = params.get("users");
    if (params.get("subscription")) subscriptionSelectField.value = params.get("subscription");
  }

  function bindFormSubmit(form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      var formData = new FormData(form);
      var submitBtn = document.getElementById("submission");
      var alertDiv = document.getElementById("alert");
      var email = formData.get("email");

      alertDiv.className = "alert-message";
      alertDiv.textContent = "";
      alertDiv.style.display = "none";

      submitBtn.disabled = true;
      submitBtn.querySelector(".btn-text").textContent = "Submitting...";
      submitBtn.querySelector(".btn-loader").style.display = "inline-block";

      try {
        var emailCheckResponse = await checkEmailExists(email);
        if (emailCheckResponse.exists) {
          alertDiv.textContent =
            "This email is already associated with an existing company. Please use a different email or contact support.";
          alertDiv.className = "alert-message error";
          alertDiv.style.display = "block";
          submitBtn.disabled = false;
          submitBtn.querySelector(".btn-text").textContent = "Get My Custom Proposal";
          submitBtn.querySelector(".btn-loader").style.display = "none";
          return;
        }

        var jsonData = {};
        formData.forEach(function (value, key) {
          if (key.endsWith("[]")) {
            var cleanKey = key.replace("[]", "");
            if (!jsonData[cleanKey]) jsonData[cleanKey] = [];
            jsonData[cleanKey].push(value);
          } else {
            jsonData[key] = value;
          }
        });

        var callbackName = "jsonp_callback_" + Math.round(100000 * Math.random());
        window[callbackName] = function (data) {
          delete window[callbackName];
          if (script.parentNode) document.body.removeChild(script);

          if (data.result === "success") {
            form.style.display = "none";
            document.getElementById("confirmation-message").style.display = "block";
          } else {
            alertDiv.textContent = "Error: " + (data.error || "Submission failed");
            alertDiv.className = "alert-message error";
            alertDiv.style.display = "block";
          }

          submitBtn.disabled = false;
          submitBtn.querySelector(".btn-text").textContent = "Get My Custom Proposal";
          submitBtn.querySelector(".btn-loader").style.display = "none";
        };

        var script = document.createElement("script");
        var url = new URL(form.action);
        url.searchParams.set("callback", callbackName);
        url.searchParams.set("data", encodeURIComponent(JSON.stringify(jsonData)));

        script.src = url.toString();
        script.onerror = function () {
          alertDiv.textContent = "Network error. Please check your connection and try again.";
          alertDiv.className = "alert-message error";
          alertDiv.style.display = "block";
          submitBtn.disabled = false;
          submitBtn.querySelector(".btn-text").textContent = "Get My Custom Proposal";
          submitBtn.querySelector(".btn-loader").style.display = "none";
          delete window[callbackName];
          if (script.parentNode) document.body.removeChild(script);
        };

        document.body.appendChild(script);
      } catch (error) {
        console.error("Submission error:", error);
        alertDiv.textContent = "Error submitting form. Please try again.";
        alertDiv.className = "alert-message error";
        alertDiv.style.display = "block";
        submitBtn.disabled = false;
        submitBtn.querySelector(".btn-text").textContent = "Get My Custom Proposal";
        submitBtn.querySelector(".btn-loader").style.display = "none";
      }
    });
  }

  function init() {
    var form = document.getElementById("custom_request_form");
    if (!form) return;
    bindFormSubmit(form);
    bindCheckboxAndRadioUI();
    applyStoredPricingSelection();

    var agentId = new URLSearchParams(window.location.search).get("agent");
    if (agentId) {
      var agentField = document.getElementById("agent_id");
      if (agentField) agentField.value = agentId;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
