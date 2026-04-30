### The Vision

- We are a team responsible for building a billing solution for the suite of products in our portfolio.
- The goal is to have one unified service to handle all types of subscriptions and payments, across all of our markets and for different products.
- Currently, our billing logic is scattered across multiple legacy systems, causing data silos and 'split-brain' scenarios, where a user is billed in different ways for different features and products

### The Case: The "Universal Upgrade" Workflow

For this particular case, we are focusing on the **Upgrade Path**. We need a robust, scalable way to transition users from a 'Free' or 'Basic' tier to a 'Pro' or 'Enterprise' tier, using a single endpoint for all our products and markets. This is the highest-value interaction in our app, and it must be both bulletproof and extendable.

### Core Product Requirements

1. **Subscription State workflow:** The system must validate the transition. We have to make sure to have solid rules regarding each case scenario. For example, a user shouldn't be able to "upgrade" to a plan they already have, and an "Enterprise" user shouldn't be downgraded without a specific administrative override.
2. **One Platform:** While we use Chargebee today, our expansion into the other markets and product acquisitions mean, we will likely integrate other providers within the next 6-12 months. The architecture must be provider-agnostic.
3. **Cross-Service Notifications:** Once a upgrade is confirmed, other services (e.g., the "Feature Flag Service" and the "Email Service") need to be notified immediately to unlock the product capabilities.
4. **Auditability:** Every plan change must be logged with a reason, a timestamp, and the transaction ID for compliance and customer support troubleshooting.

### Technical Constraints

- **Framework:** The solution is built using **NestJS with TypeScript** to align with our new company-wide standard. We are aiming on using framework’s best practices and utilize framework features as much as possible
- **Data Integrity and source of truth:** We cannot afford "zombie subscriptions" or corrupted data in general. If the payment succeeds but our internal database update fails, the system must handle this gracefully. State of the system must be eventually consistent with the state of the external billing provider
- **Validation:** All incoming requests must be strictly typed and validated accordingly to the business rules, before reaching the business logic.

