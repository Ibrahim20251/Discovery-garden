document.addEventListener("DOMContentLoaded", () => {
    const enquiryForm = document.getElementById("enquiryForm");
    const recipientEmail = "Lovelymaray472@gmail.com"; // fallback recipient for mailto

    // EmailJS configuration - replace these with your actual IDs from EmailJS (https://www.emailjs.com)
    
    const EMAILJS_USER_ID = "YOUR_EMAILJS_USER_ID"; // e.g. user_xxx
    const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID"; // e.g. service_xxx
    const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // e.g. template_xxx

    // Initialize EmailJS if the SDK loaded and user ID provided
    if (window.emailjs && EMAILJS_USER_ID !== "YOUR_EMAILJS_USER_ID") {
        emailjs.init(EMAILJS_USER_ID);
    }

    if (enquiryForm) {
        enquiryForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const clientName = document.getElementById("name").value;
            const clientPhone = document.getElementById("phone").value;
            const eventType = document.getElementById("eventType").value;
            const clientNotes = document.getElementById("notes").value;

            console.log("New Booking Enquiry Received:", {
                name: clientName,
                phone: clientPhone,
                type: eventType,
                notes: clientNotes
            });

            const templateParams = {
                to_email: recipientEmail,
                from_name: clientName,
                phone: clientPhone,
                event_type: eventType,
                message: clientNotes
            };

            // Try to send via EmailJS if configured, otherwise fallback to mailto
            
            if (window.emailjs && EMAILJS_USER_ID !== "YOUR_EMAILJS_USER_ID") {
                emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                    .then((response) => {
                        console.log('EmailJS success', response.status, response.text);
                        alert(`Thank you, ${clientName}! Your enquiry was sent successfully.`);
                        enquiryForm.reset();
                    }, (error) => {
                        console.error('EmailJS failed, falling back to mailto', error);
                        fallbackMailto();
                    });
            } else {
                // Inform the user about the fallback and open their mail client
                fallbackMailto();
            }

            function fallbackMailto() {
                const subject = `Booking enquiry from ${clientName} — ${eventType}`;
                const bodyLines = [
                    `Name: ${clientName}`,
                    `Phone: ${clientPhone}`,
                    `Event Type: ${eventType}`,
                    `Details: ${clientNotes}`
                ];
                const body = bodyLines.join("\n");
                const mailtoURL = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.location.href = mailtoURL;
                alert(`A new email has been opened in your email client. Please send it to complete submission.`);
                enquiryForm.reset();
            }
        });
    }
});