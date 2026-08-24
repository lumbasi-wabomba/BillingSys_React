API Needs
CampusCore → Billing/POS
1.	CampusCore needs to create an invoice for an event registration in order to charge a student for a paid campus event.
2.	CampusCore needs to retrieve invoice details in order to view the amount and billing information associated with an event registration.
3.	CampusCore needs to retrieve payment status in order to determine whether a student's event registration has been paid.
Billing/POS → CampusCore
4.	Billing/POS needs to retrieve customer information in order to associate an invoice with the correct student.
5.	Billing/POS needs to retrieve registration details in order to identify the event and registration associated with the invoice.
6.	Billing/POS needs to retrieve event pricing information in order to calculate the total amount to be included in the invoice.
Reflection
Through our discussion with the CampusCore team, we identified the main API needs between the two systems. CampusCore requires the Billing/POS system to create and provide invoice and payment information for students registering for paid events. In return, the Billing/POS system requires customer, registration, and event pricing information from CampusCore to create and calculate the appropriate invoice. This helped us understand the specific data and actions that need to be exchanged between the two systems for the integration to work.

