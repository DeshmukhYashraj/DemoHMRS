// src/services/holidayService.js
//
// Maps to HolidayController  →  @RequestMapping("/api/holidays")
// VITE_API_BASE_URL already includes /api, so paths start with /holidays.
//
// ── Field mapping (frontend  ↔  backend DTO) ──────────────────────────────
//   Frontend key   │ Request DTO field  │ Response DTO field
//   ───────────────┼────────────────────┼───────────────────
//   holidayName    │ holidayName        │ holidayName
//   holidayDate    │ holidayDate        │ holidayDate   (LocalDate → "YYYY-MM-DD")
//   holidayType    │ holidayType        │ holidayType   (HolidayType enum)
//   description    │ description        │ description
//   isOptional     │ isOptional         │ isOptional
//
// ⚠️  Backend Note:
//   HolidayResponseDTO is missing the `isActive` field even though the
//   entity has it.  Until that is added to the DTO the frontend will not
//   receive active-status from the server.  See comment in HolidayManagement.
//
import apiClient from './apiClient'

const holidayService = {

  /** POST /holidays  →  ADMIN + HR */
  create: (dto) =>
    apiClient.post('/holidays', dto),

  /**
   * PATCH /holidays/:id  →  ADMIN + HR
   * Backend uses @PatchMapping so partial updates are supported.
   */
  update: (id, dto) =>
    apiClient.patch(`/holidays/${id}`, dto),

  /** GET /holidays/:id  →  ADMIN + HR */
  getById: (id) =>
    apiClient.get(`/holidays/${id}`),

  /**
   * GET /holidays?page=0&size=8  →  ADMIN + HR
   * @param {number} page  0-based
   * @param {number} size
   */
  getAll: (page = 0, size = 8) =>
    apiClient.get('/holidays', { params: { page, size } }),

  /** DELETE /holidays/:id  →  ADMIN only */
  delete: (id) =>
    apiClient.delete(`/holidays/${id}`),
}

export default holidayService