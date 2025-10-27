// 1. Create payment request
export const createPayment = async (orderData) => {
  try {
    const {
      address,
      amount,
      city,
      country,
      currency,
      email,
      first_name,
      items,
      last_name,
      order_id,
      phone,
    } = orderData;
    
    console.log("Creating payment with data:", orderData);
    
    // Call our own API to create payment and get hash
    const response = await fetch(`/api/payment/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: order_id,
        items: items,
        amount: amount,
        currency: currency,
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone: phone,
        address: address,
        city: city,
        country: country,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Payment creation failed");
    }

    const data = await response.json();
    console.log("Payment created:", data);
    
    // Redirect to PayHere with the generated fields
    redirectToPayHere(data.payhere_fields);
  } catch (error) {
    console.error("Payment error:", error);
    alert(`Failed to initiate payment: ${error.message}`);
    throw error;
  }
};

// 2. Redirect to PayHere
function redirectToPayHere(fields) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = fields.payhere_url; // URL comes from our backend

  // Remove payhere_url from fields before creating inputs
  const { payhere_url, ...formFields } = fields;

  Object.entries(formFields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    }
  });

  document.body.appendChild(form);
  console.log("Submitting payment form to PayHere...");
  form.submit();
}

// 3. Verify payment after return
export const verifyPayment = async (orderId) => {
  try {
    const response = await fetch(`/api/payment/verify/${orderId}`);
    
    if (!response.ok) {
      throw new Error("Payment verification failed");
    }
    
    const data = await response.json();
    console.log("Payment verification:", data);
    return data;
  } catch (error) {
    console.error("Verification error:", error);
    throw error;
  }
};
