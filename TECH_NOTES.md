# Tech Notes

## What was built

- **Authentication System Migration**: Updated the entire authentication flow from manual token management to httpOnly cookies. Removed all client-side token storage and cookie manipulation, relying on server-managed httpOnly cookies for security.

- **Dashboard Layout**: Created a responsive dashboard with a collapsible sidebar using shadcn UI components. The sidebar includes navigation items and a user profile section at the bottom with dropdown menu for profile access and logout.

- **Bookings Management System**: Built a complete bookings CRUD interface including:

  - Bookings table displaying all user bookings with columns for booking number, service type, description, scheduled date, location, status, and created date
  - Create booking modal with form validation
  - Update booking modal for editing booking details
  - Cancel booking functionality via dropdown menu
  - Status display and management

- **Profile Management**: Created a profile page for password updates with validation for password requirements (uppercase, lowercase, numbers, minimum 8 characters).

- **Component Architecture**: Implemented a component-based approach with reusable components:
  - `DashboardLayout` - Main layout wrapper
  - `AppSidebar` - Navigation sidebar
  - `UserProfile` - User profile dropdown component
  - `BookingsTable` - Bookings display and management
  - `BookingFormModal` - Create/update booking form

## Reasoning behind your approach

- **httpOnly Cookies**: Chose httpOnly cookies over localStorage/sessionStorage for authentication tokens to prevent XSS attacks. Cookies are automatically sent with requests via `withCredentials: true`, eliminating manual token management.

- **shadcn UI Components**: Used shadcn UI components for consistency, accessibility, and modern design. Components are copy-paste friendly and customizable.

- **Component-Based Architecture**: Separated concerns into reusable components to improve maintainability, testability, and code reusability. Each component has a single responsibility.

- **Dropdown Menu for Actions**: Used dropdown menu instead of popover for table actions as it's more reliable in table contexts, handles positioning automatically, and follows common UI patterns.

- **TypeScript Interfaces**: Defined clear TypeScript interfaces for type safety and better developer experience with autocomplete and error catching.

- **API Layer Abstraction**: Created separate API modules (`auth.ts`, `bookings.ts`) to centralize API calls, making it easier to update endpoints and handle errors consistently.

## Assumptions made

- Backend API returns booking objects with `id` field (not `_id`) matching the frontend interface
- Backend supports httpOnly cookie authentication and sets cookies automatically on login/register
- Backend API endpoints follow RESTful conventions (`GET /bookings`, `POST /bookings`, `PUT /bookings/:id`, etc.)
- Booking status can be updated via the general update endpoint by sending `status` field
- User authentication state is checked via `/auth/me` endpoint
- All API responses follow a consistent structure with `success`, `data`, and `message` fields
- Password update endpoint exists at `/auth/password` accepting `currentPassword` and `newPassword`

## Potential improvements

- **Error Handling**: Add toast notifications for better user feedback on success/error states instead of inline error messages
- **Loading States**: Implement skeleton loaders for better perceived performance during data fetching
- **Pagination**: Add pagination for bookings table when the number of bookings grows large
- **Filtering & Sorting**: Add ability to filter bookings by status and sort by different columns
- **Optimistic Updates**: Implement optimistic UI updates for better perceived performance when cancelling/updating bookings
- **Form Validation**: Add more comprehensive client-side validation with better error messages
- **Accessibility**: Add ARIA labels and keyboard navigation improvements
- **Testing**: Add unit tests for components and integration tests for API calls
- **Caching**: Implement React Query or SWR for better data caching and synchronization
- **Real-time Updates**: Consider WebSocket integration for real-time booking status updates
- **File Uploads**: Add support for booking attachments if needed in the future
- **Search Functionality**: Add search capability to filter bookings by booking number, service type, etc.

## How AI assisted your workflow

- **Component Generation**: AI generated complete component code following shadcn UI patterns and React best practices
- **API Integration**: AI created API abstraction layers with proper TypeScript typing
- **Bug Fixes**: AI identified and fixed issues like missing key props, incorrect field names (`_id` vs `id`), and API endpoint mismatches
- **Code Refactoring**: AI suggested and implemented better patterns (dropdown menu vs popover, proper error handling)
- **Type Safety**: AI ensured TypeScript interfaces matched backend responses and updated types when discrepancies were found
- **Documentation**: AI provided inline comments and structured code for better readability
- **Problem Solving**: AI helped debug issues like popover not showing by suggesting alternative approaches (dropdown menu)

## Setup

- Run in local only.
- Install the dependencies by running npm install
- Start the app by running npm run dev
