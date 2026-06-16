/* =================================================================
   app.js — LibSpace ระบบจองห้องสมุดและพื้นที่เรียนรู้
   JavaScript หลักสำหรับควบคุมการทำงานทั้งหมดของระบบ
================================================================= */

/* =================================================================
   ข้อมูลจำลอง (Mock Data) — ใช้แทนข้อมูลจากฐานข้อมูลจริง
================================================================= */

// ข้อมูลผู้ใช้จำลอง
const MOCK_USER = {
    name: 'นายธีรพงศ์ มานะ',
    id: '64010001',
    faculty: 'คณะวิศวกรรมศาสตร์',
    quota: { used: 6, total: 20 },
};

// ข้อมูลรายการจองจำลอง (ใช้ร่วมกันทั้ง User และ Admin)
let MOCK_BOOKINGS = [
    { id: 'BK001', code: 'BK-2568-001', user: 'นายธีรพงศ์ มานะ',    studentId: '64010001', room: 'ห้องติวกลุ่ม A101', type: 'group',  date: '15 มิ.ย. 2568', time: '13:00–15:00', location: 'ชั้น 2 อาคาร A', status: 'confirmed' },
    { id: 'BK002', code: 'BK-2568-002', user: 'นางสาวพิมพ์ใจ รัตน์',  studentId: '64020045', room: 'โซนเงียบ Zone B',    type: 'quiet', date: '15 มิ.ย. 2568', time: '09:00–11:00', location: 'ชั้น 3 อาคาร B', status: 'pending'   },
    { id: 'BK003', code: 'BK-2568-003', user: 'นายกิตติ วงศ์ศรี',     studentId: '64030012', room: 'ห้องเดี่ยว B201',   type: 'solo',  date: '15 มิ.ย. 2568', time: '10:00–12:00', location: 'ชั้น 2 อาคาร B', status: 'checkedin' },
    { id: 'BK004', code: 'BK-2568-004', user: 'นางสาวสุดารัตน์ ใจดี', studentId: '65010088', room: 'ห้องติวกลุ่ม B301', type: 'group',  date: '15 มิ.ย. 2568', time: '14:00–16:00', location: 'ชั้น 3 อาคาร B', status: 'pending'   },
    { id: 'BK005', code: 'BK-2568-005', user: 'นายภัทรพล สว่าง',      studentId: '65020033', room: 'โซนเงียบ Zone A',   type: 'quiet', date: '15 มิ.ย. 2568', time: '08:00–10:00', location: 'ชั้น 1 อาคาร A', status: 'confirmed' },
    { id: 'BK006', code: 'BK-2568-006', user: 'นางสาวรัชนี พรม',       studentId: '65030067', room: 'ห้องติวกลุ่ม A102', type: 'group', date: '15 มิ.ย. 2568', time: '11:00–13:00', location: 'ชั้น 2 อาคาร A', status: 'cancelled' },
    { id: 'BK007', code: 'BK-2568-007', user: 'นายวชิรวิทย์ นาม',     studentId: '63010054', room: 'ห้องเดี่ยว B202',   type: 'solo',  date: '16 มิ.ย. 2568', time: '09:00–11:00', location: 'ชั้น 2 อาคาร B', status: 'pending'   },
    { id: 'BK008', code: 'BK-2568-008', user: 'นางสาวณัฐิดา เมือง',   studentId: '64040021', room: 'โซนเงียบ Zone A',   type: 'quiet', date: '16 มิ.ย. 2568', time: '13:00–15:00', location: 'ชั้น 1 อาคาร A', status: 'pending'   },
];

// ข้อมูลห้องและพื้นที่จำลอง
let MOCK_ROOMS = [
    { id: 'R001', name: 'ห้องติวกลุ่ม A101', code: 'A101', type: 'group',  typeLabel: 'ห้องติวกลุ่ม', capacity: 8,  floor: 2, building: 'A', status: 'open',        bookingsToday: 5, equipment: 'ไวท์บอร์ด, โปรเจคเตอร์, ปลั๊กไฟ' },
    { id: 'R002', name: 'ห้องติวกลุ่ม A102', code: 'A102', type: 'group',  typeLabel: 'ห้องติวกลุ่ม', capacity: 8,  floor: 2, building: 'A', status: 'open',        bookingsToday: 4, equipment: 'ไวท์บอร์ด, โปรเจคเตอร์' },
    { id: 'R003', name: 'โซนเงียบ Zone A',   code: 'ZA',   type: 'quiet',  typeLabel: 'โซนเงียบ',      capacity: 20, floor: 1, building: 'A', status: 'open',        bookingsToday: 6, equipment: 'โต๊ะอ่านหนังสือ, ปลั๊กไฟ' },
    { id: 'R004', name: 'โซนเงียบ Zone B',   code: 'ZB',   type: 'quiet',  typeLabel: 'โซนเงียบ',      capacity: 15, floor: 3, building: 'B', status: 'open',        bookingsToday: 3, equipment: 'โต๊ะอ่านหนังสือ, เก้าอี้นวม' },
    { id: 'R005', name: 'ห้องเดี่ยว B201',   code: 'B201', type: 'solo',   typeLabel: 'ห้องเดี่ยว',    capacity: 1,  floor: 2, building: 'B', status: 'maintenance', bookingsToday: 0, equipment: 'โต๊ะ, ปลั๊กไฟ, แอร์' },
    { id: 'R006', name: 'ห้องเดี่ยว B202',   code: 'B202', type: 'solo',   typeLabel: 'ห้องเดี่ยว',    capacity: 1,  floor: 2, building: 'B', status: 'open',        bookingsToday: 2, equipment: 'โต๊ะ, ปลั๊กไฟ, แอร์' },
    { id: 'R007', name: 'ห้องติวกลุ่ม B301', code: 'B301', type: 'group',  typeLabel: 'ห้องติวกลุ่ม', capacity: 12, floor: 3, building: 'B', status: 'open',        bookingsToday: 4, equipment: 'ไวท์บอร์ด, TV 65", ปลั๊กไฟ' },
    { id: 'R008', name: 'ห้องเดี่ยว C101',   code: 'C101', type: 'solo',   typeLabel: 'ห้องเดี่ยว',    capacity: 1,  floor: 1, building: 'C', status: 'closed',      bookingsToday: 0, equipment: 'โต๊ะ, ปลั๊กไฟ' },
];

// วันในสัปดาห์สำหรับแสดงผล (ภาษาไทย)
const THAI_DAYS  = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
const THAI_MONTHS = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];

/* =================================================================
   สถานะของแอป (App State)
================================================================= */
const state = {
    role:            'user',    // 'user' | 'admin'
    currentPage:     'user-dashboard',

    // Booking Flow State
    selectedRoomType:  null,    // 'group' | 'quiet' | 'solo'
    selectedDateLabel: null,    // เช่น '15 มิ.ย. 2568'
    selectedTimeLabel: null,    // เช่น '13:00–15:00'
    selectedSlotEnd:   null,    // เช่น '15:00'

    // ตั๋วที่กำลังแสดง
    activeTicketId: 'BK001',

    // Counter สำหรับ ID การจองใหม่
    bookingCounter: 9,
};

/* =================================================================
   ฟังก์ชันเปลี่ยน Role (User ↔ Admin)
================================================================= */
function switchRole(role) {
    state.role = role;
    document.body.classList.toggle('admin-role', role === 'admin');

    // อัปเดตปุ่มใน Role Bar
    document.getElementById('btn-role-user').classList.toggle('role-btn-active', role === 'user');
    document.getElementById('btn-role-admin').classList.toggle('role-btn-active', role === 'admin');

    // แสดง/ซ่อนเมนูตาม Role
    document.getElementById('nav-user').classList.toggle('hidden', role !== 'user');
    document.getElementById('nav-admin').classList.toggle('hidden', role !== 'admin');

    // อัปเดต Sidebar Profile
    if (role === 'admin') {
        document.getElementById('sidebar-role-label').textContent = 'Admin Portal';
        document.getElementById('sidebar-profile-name').textContent = 'นายสมชาย ผู้ดูแล';
        document.getElementById('sidebar-profile-id').textContent = 'Admin ID: ADM001';
        document.getElementById('sidebar-avatar').textContent = 'ส';
    } else {
        document.getElementById('sidebar-role-label').textContent = 'Student Portal';
        document.getElementById('sidebar-profile-name').textContent = MOCK_USER.name;
        document.getElementById('sidebar-profile-id').textContent = 'รหัส: ' + MOCK_USER.id;
        document.getElementById('sidebar-avatar').textContent = 'ธ';
    }

    // นำทางไปหน้าเริ่มต้นของ Role นั้น
    const defaultPage = role === 'admin' ? 'admin-dashboard' : 'user-dashboard';
    navigate(defaultPage);
}

/* =================================================================
   ฟังก์ชันนำทางระหว่างหน้า (SPA Navigation)
================================================================= */
function navigate(pageId) {
    // ซ่อนทุกหน้า
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('page-active');
    });

    // แสดงหน้าที่ต้องการ
    const target = document.getElementById('page-' + pageId);
    if (target) {
        target.classList.add('page-active');
        state.currentPage = pageId;
        // Scroll กลับไปด้านบน
        document.getElementById('main-content').scrollTo({ top: 0, behavior: 'smooth' });
    }

    // อัปเดต Active State ของเมนู
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.toggle('nav-item-active', btn.dataset.page === pageId);
    });

    // Render เนื้อหาแบบ Dynamic เมื่อเข้าหน้า
    if (pageId === 'user-ticket')      renderAllTickets();
    if (pageId === 'admin-bookings')   renderBookingsTable('all');
    if (pageId === 'admin-rooms')      renderRoomCards();
    if (pageId === 'admin-dashboard')  renderAdminMiniStats();
    if (pageId === 'user-ticket')      drawQRCode();
}

/* =================================================================
   USER: Booking Flow — ขั้นตอนการจองห้อง
================================================================= */

/* เลือกประเภทห้อง */
function selectRoomType(type, el) {
    state.selectedRoomType = type;

    // ล้าง selected state เก่า
    document.querySelectorAll('.room-type-card').forEach(c => c.classList.remove('rt-selected'));
    el.classList.add('rt-selected');

    // แสดงปุ่มถัดไป
    document.getElementById('btn-step1-next').classList.remove('hidden');
}

/* เลื่อนไปยังขั้นตอนที่กำหนด */
function goToStep(step) {
    // Validate
    if (step === 2 && !state.selectedRoomType) {
        showAlert('⚠️', 'กรุณาเลือกประเภทห้อง', 'กรุณาเลือกประเภทพื้นที่ที่ต้องการก่อน');
        return;
    }
    if (step === 3 && (!state.selectedDateLabel || !state.selectedTimeLabel)) {
        showAlert('⚠️', 'ข้อมูลยังไม่ครบ', 'กรุณาเลือกวันที่และช่วงเวลาก่อนดำเนินการต่อ');
        return;
    }

    // ซ่อนทุก Step
    document.querySelectorAll('.booking-step').forEach(s => s.classList.remove('booking-step-active'));
    document.getElementById('booking-step-' + step).classList.add('booking-step-active');

    // อัปเดต Step Indicators
    updateStepIndicators(step);

    // ถ้าเป็นขั้นตอนที่ 2 → สร้าง Date & Time Slots
    if (step === 2) renderDateGrid();

    // ถ้าเป็นขั้นตอนที่ 3 → แสดงสรุป
    if (step === 3) renderBookingSummary();

    document.getElementById('main-content').scrollTo({ top: 0, behavior: 'smooth' });
}

/* อัปเดตแถบขั้นตอน */
function updateStepIndicators(activeStep) {
    for (let i = 1; i <= 3; i++) {
        const circle = document.querySelector(`#step-indicator-${i} .step-circle`);
        const label  = document.querySelector(`#step-indicator-${i} .step-label`);
        if (!circle) continue;
        circle.classList.remove('step-active-circle', 'step-done-circle');
        label.classList.remove('step-active-label');

        if (i < activeStep) {
            circle.classList.add('step-done-circle');
            circle.textContent = '✓';
        } else if (i === activeStep) {
            circle.classList.add('step-active-circle');
            circle.textContent = i;
            label.classList.add('step-active-label');
        } else {
            circle.textContent = i;
        }
    }
}

/* สร้าง Date Cards 7 วันข้างหน้า */
function renderDateGrid() {
    const grid = document.getElementById('date-grid');
    grid.innerHTML = '';

    const today = new Date(2026, 5, 15); // จำลอง: 15 มิ.ย. 2568 (2025 CE = 2568 BE)
    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);

        const dayName  = THAI_DAYS[d.getDay()];
        const dateNum  = d.getDate();
        const monthTh  = THAI_MONTHS[d.getMonth()];
        const isWeekend = (d.getDay() === 0 || d.getDay() === 6);
        const label = `${dateNum} ${monthTh} ${d.getFullYear() + 543}`;

        const card = document.createElement('div');
        card.className = 'date-card' + (isWeekend ? ' date-weekend' : '');
        card.innerHTML = `
            <p class="date-day">${dayName}</p>
            <p class="date-num">${dateNum}</p>
            <p class="date-month">${monthTh}</p>
        `;
        card.onclick = () => selectDate(card, label);
        grid.appendChild(card);
    }
}

/* เลือกวันที่ */
function selectDate(el, label) {
    state.selectedDateLabel = label;
    state.selectedTimeLabel = null;
    state.selectedSlotEnd   = null;

    document.querySelectorAll('.date-card').forEach(c => c.classList.remove('date-selected'));
    el.classList.add('date-selected');

    // ซ่อนปุ่มถัดไปจนกว่าจะเลือก Time Slot
    document.getElementById('btn-step2-next').classList.add('hidden');

    // แสดง Time Slots
    document.getElementById('timeslot-hint').classList.add('hidden');
    renderTimeSlots();
}

/* สร้าง Time Slot Cards */
function renderTimeSlots() {
    const grid = document.getElementById('timeslot-grid');
    const slots = [
        { time: '08:00–10:00', end: '10:00', booked: false },
        { time: '09:00–11:00', end: '11:00', booked: true  },
        { time: '10:00–12:00', end: '12:00', booked: false },
        { time: '11:00–13:00', end: '13:00', booked: true  },
        { time: '13:00–15:00', end: '15:00', booked: false },
        { time: '14:00–16:00', end: '16:00', booked: false },
        { time: '15:00–17:00', end: '17:00', booked: true  },
        { time: '16:00–18:00', end: '18:00', booked: false },
        { time: '18:00–20:00', end: '20:00', booked: false },
    ];

    grid.innerHTML = '';
    slots.forEach(slot => {
        const card = document.createElement('div');
        card.className = 'timeslot-card' + (slot.booked ? ' ts-booked' : '');
        card.innerHTML = `
            <p class="ts-icon">${slot.booked ? '🔴' : '🟢'}</p>
            <p class="ts-time">${slot.time}</p>
            <p class="ts-status">${slot.booked ? 'ไม่ว่าง' : 'ว่าง'}</p>
        `;
        if (!slot.booked) {
            card.onclick = () => selectTimeSlot(card, slot.time, slot.end);
        }
        grid.appendChild(card);
    });
}

/* เลือก Time Slot */
function selectTimeSlot(el, timeLabel, end) {
    state.selectedTimeLabel = timeLabel;
    state.selectedSlotEnd   = end;

    document.querySelectorAll('.timeslot-card:not(.ts-booked)').forEach(c => c.classList.remove('ts-selected'));
    el.classList.add('ts-selected');

    document.getElementById('btn-step2-next').classList.remove('hidden');
}

/* แสดงสรุปการจองในขั้นตอนที่ 3 */
function renderBookingSummary() {
    const typeLabels = { group: 'ห้องติวกลุ่ม', quiet: 'โซนเงียบ', solo: 'ห้องเดี่ยว' };
    const roomNames  = { group: 'ห้องติวกลุ่ม A101', quiet: 'โซนเงียบ Zone A', solo: 'ห้องเดี่ยว B202' };

    document.getElementById('sum-type').textContent = typeLabels[state.selectedRoomType] || '—';
    document.getElementById('sum-room').textContent = roomNames[state.selectedRoomType]  || '—';
    document.getElementById('sum-date').textContent = state.selectedDateLabel || '—';
    document.getElementById('sum-time').textContent = state.selectedTimeLabel || '—';
}

/* ยืนยันการจอง → สร้าง Booking ใหม่ */
function confirmBooking() {
    const typeLabels = { group: 'ห้องติวกลุ่ม', quiet: 'โซนเงียบ', solo: 'ห้องเดี่ยว' };
    const roomNames  = {
        group: 'ห้องติวกลุ่ม A101',
        quiet: 'โซนเงียบ Zone A',
        solo:  'ห้องเดี่ยว B202',
    };
    const locations = {
        group: 'ชั้น 2 อาคาร A',
        quiet: 'ชั้น 1 อาคาร A',
        solo:  'ชั้น 2 อาคาร B',
    };

    const n = state.bookingCounter++;
    const code = `BK-2568-${String(n).padStart(3, '0')}`;

    // เพิ่ม Booking ใหม่เข้า Mock Data
    const newBooking = {
        id:        'BK' + String(n).padStart(3, '0'),
        code,
        user:      MOCK_USER.name,
        studentId: MOCK_USER.id,
        room:      roomNames[state.selectedRoomType],
        type:      state.selectedRoomType,
        date:      state.selectedDateLabel,
        time:      state.selectedTimeLabel,
        location:  locations[state.selectedRoomType],
        status:    'pending',
    };
    MOCK_BOOKINGS.unshift(newBooking);
    state.activeTicketId = newBooking.id;

    // แสดง Success Modal
    document.getElementById('modal-desc').textContent =
        `การจอง "${roomNames[state.selectedRoomType]}" วันที่ ${state.selectedDateLabel} เวลา ${state.selectedTimeLabel} ถูกส่งรออนุมัติแล้ว`;
    document.getElementById('modal-booking-code').textContent = 'รหัส: ' + code;
    document.getElementById('success-modal').classList.remove('hidden');

    // Reset Form
    state.selectedRoomType  = null;
    state.selectedDateLabel = null;
    state.selectedTimeLabel = null;
    document.querySelectorAll('.room-type-card').forEach(c => c.classList.remove('rt-selected'));
    document.getElementById('btn-step1-next').classList.add('hidden');
    goToStep(1);
}

/* =================================================================
   USER: ตั๋วการจอง (Ticket)
================================================================= */

/* แสดงตั๋วเฉพาะ ID */
function showTicket(bookingId) {
    state.activeTicketId = bookingId;
    navigate('user-ticket');
}

/* เรียกจาก Dashboard */
function showTicketFromDashboard(id) { showTicket(id); }

/* Render ตั๋วหลัก */
function renderTicket(booking) {
    const statusLabels = {
        confirmed:  '✓ อนุมัติแล้ว',
        pending:    '⏳ รออนุมัติ',
        checkedin:  '✅ เช็คอินแล้ว',
        cancelled:  '✗ ยกเลิก',
    };
    const statusClasses = {
        confirmed:  'background: rgba(34,197,94,0.2); border-color: rgba(34,197,94,0.4); color:#fff;',
        pending:    'background: rgba(245,158,11,0.2); border-color: rgba(245,158,11,0.4); color:#fff;',
        checkedin:  'background: rgba(59,130,246,0.2); border-color: rgba(59,130,246,0.4); color:#fff;',
        cancelled:  'background: rgba(239,68,68,0.2);  border-color: rgba(239,68,68,0.4);  color:#fff;',
    };

    document.getElementById('tk-room-name').textContent = booking.room;
    document.getElementById('tk-code').textContent      = booking.code;
    document.getElementById('tk-date').textContent      = booking.date;
    document.getElementById('tk-time').textContent      = booking.time + ' น.';
    document.getElementById('tk-location').textContent  = booking.location || 'ชั้น 2 อาคาร A';
    document.getElementById('tk-user').textContent      = booking.user;
    document.getElementById('qr-code-display').textContent = booking.code;

    const endTime = booking.time ? booking.time.split('–')[1] || '—' : '—';
    document.getElementById('qr-valid-until').textContent = 'ใช้ได้ถึงเวลา ' + endTime + ' น.';

    const statusEl = document.getElementById('tk-status');
    statusEl.textContent = statusLabels[booking.status] || booking.status;
    statusEl.style.cssText += statusClasses[booking.status] || '';
}

/* Render รายการจองทั้งหมดของ User */
function renderAllTickets() {
    // แสดงตั๋วหลัก
    const activeBooking = MOCK_BOOKINGS.find(b => b.id === state.activeTicketId) || MOCK_BOOKINGS[0];
    if (activeBooking) renderTicket(activeBooking);
    drawQRCode();

    // รายการ List
    const myBookings = MOCK_BOOKINGS.filter(b => b.studentId === MOCK_USER.id);
    const listEl = document.getElementById('my-bookings-list');

    if (myBookings.length === 0) {
        listEl.innerHTML = '<p style="color:#94A3B8;text-align:center;padding:20px;">ยังไม่มีประวัติการจอง</p>';
        return;
    }

    const statusPills = {
        confirmed:  '<span class="status-pill pill-confirmed">✓ อนุมัติ</span>',
        pending:    '<span class="status-pill pill-pending">⏳ รออนุมัติ</span>',
        checkedin:  '<span class="status-pill pill-checkedin">✅ เช็คอิน</span>',
        cancelled:  '<span class="status-pill pill-cancelled">✗ ยกเลิก</span>',
    };

    listEl.innerHTML = myBookings.map(b => `
        <div class="my-booking-row">
            <div style="flex:1">
                <p class="my-bk-room">${b.room}</p>
                <p class="my-bk-time">${b.date} · ${b.time} น. · ${b.code}</p>
            </div>
            ${statusPills[b.status] || ''}
            ${b.status !== 'cancelled' ? `<button onclick="showTicket('${b.id}')" class="btn btn-sm btn-primary">ดูตั๋ว</button>` : ''}
        </div>
    `).join('');
}

/* =================================================================
   QR Code จำลอง (วาดด้วย Canvas API)
================================================================= */
function drawQRCode() {
    const canvas = document.getElementById('qr-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 160;
    const mod  = 21; // QR Version 1 = 21x21 modules
    const cell = Math.floor(size / mod);

    // พื้นหลังสีขาว
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#1E1B4B';

    // ฟังก์ชันวาดสี่เหลี่ยมหน่วย
    const drawCell = (col, row) => {
        ctx.fillRect(col * cell + 1, row * cell + 1, cell - 1, cell - 1);
    };

    // วาด Finder Pattern (มุมตรวจจับ) 3 มุม
    const drawFinder = (startX, startY) => {
        // กรอบนอก 7x7
        for (let r = 0; r < 7; r++) {
            for (let c = 0; c < 7; c++) {
                const onEdge = r === 0 || r === 6 || c === 0 || c === 6;
                const inCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
                if (onEdge || inCenter) drawCell(startX + c, startY + r);
            }
        }
    };

    drawFinder(0, 0);   // มุมบน-ซ้าย
    drawFinder(14, 0);  // มุมบน-ขวา
    drawFinder(0, 14);  // มุมล่าง-ซ้าย

    // Timing Pattern (เส้นสลับ)
    for (let i = 8; i < 13; i++) {
        if (i % 2 === 0) { drawCell(i, 6); drawCell(6, i); }
    }

    // Data Area: สร้าง Pattern จาก Hash ของรหัสการจอง
    const code = (document.getElementById('qr-code-display') || {}).textContent || 'BK-001';
    let hash = 0;
    for (let ch of code) hash = ((hash << 5) - hash) + ch.charCodeAt(0);
    hash = Math.abs(hash);

    for (let r = 0; r < mod; r++) {
        for (let c = 0; c < mod; c++) {
            // ข้าม Finder Patterns
            const inTL = r < 8 && c < 8;
            const inTR = r < 8 && c >= 13;
            const inBL = r >= 13 && c < 8;
            const onTiming = r === 6 || c === 6;
            if (inTL || inTR || inBL || onTiming) continue;

            // สุ่มจาก Hash
            const val = (hash ^ (r * 31 + c * 17) ^ (r + c) * 13) & 1;
            if (val) drawCell(c, r);
        }
    }

    // กรอบขาวแยก Finder Patterns (Quiet Zone ด้านใน)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(7 * cell, 0, cell, 8 * cell);
    ctx.fillRect(0, 7 * cell, 8 * cell, cell);
    ctx.fillRect((mod - 8) * cell, 7 * cell, cell, cell);
    ctx.fillRect(7 * cell, (mod - 8) * cell, cell, cell);
}

/* =================================================================
   ADMIN: Dashboard Mini Stats
================================================================= */
function renderAdminMiniStats() {
    // ไม่ต้อง render อะไรพิเศษ HTML ตั้งค่าไว้แล้ว
}

/* =================================================================
   ADMIN: Bookings Table (ตารางรายการจอง)
================================================================= */
function renderBookingsTable(filterStatus) {
    const tbody = document.getElementById('bookings-tbody');
    if (!tbody) return;

    const filtered = filterStatus === 'all'
        ? MOCK_BOOKINGS
        : MOCK_BOOKINGS.filter(b => b.status === filterStatus);

    const statusLabels = {
        confirmed:  { label: '✓ อนุมัติแล้ว',  cls: 'pill-confirmed' },
        pending:    { label: '⏳ รออนุมัติ',    cls: 'pill-pending'   },
        checkedin:  { label: '✅ เช็คอินแล้ว',  cls: 'pill-checkedin' },
        cancelled:  { label: '✗ ยกเลิก',        cls: 'pill-cancelled' },
    };

    tbody.innerHTML = filtered.map(b => {
        const st = statusLabels[b.status] || { label: b.status, cls: '' };

        // ปุ่มตาม Status
        let actions = '';
        if (b.status === 'pending') {
            actions = `
                <button onclick="adminApprove('${b.id}')" class="btn btn-approve btn-sm">✓ อนุมัติ</button>
                <button onclick="adminCancel('${b.id}')"  class="btn btn-danger btn-sm">✗ ยกเลิก</button>
            `;
        } else if (b.status === 'confirmed') {
            actions = `
                <button onclick="adminCheckIn('${b.id}')"  class="btn btn-checkin btn-sm">🏷️ เช็คอิน</button>
                <button onclick="adminCancel('${b.id}')"   class="btn btn-danger btn-sm">✗ ยกเลิก</button>
            `;
        } else if (b.status === 'checkedin') {
            actions = `<span style="color:#94A3B8;font-size:12px;">เสร็จสิ้น</span>`;
        } else {
            actions = `<span style="color:#94A3B8;font-size:12px;">—</span>`;
        }

        return `
            <tr id="bk-row-${b.id}">
                <td><span class="bk-code">${b.code}</span></td>
                <td>
                    <p class="bk-name">${b.user}</p>
                    <p class="bk-student-id">${b.studentId}</p>
                </td>
                <td>${b.room}</td>
                <td>${b.date}</td>
                <td>${b.time} น.</td>
                <td><span class="status-pill ${st.cls}">${st.label}</span></td>
                <td>
                    <div class="action-buttons">${actions}</div>
                </td>
            </tr>
        `;
    }).join('');

    // อัปเดต Mini Stats
    renderBookingMiniStats();
}

/* คำนวณและแสดง Mini Stats Bar */
function renderBookingMiniStats() {
    const el = document.getElementById('admin-booking-mini-stats');
    if (!el) return;
    const counts = { pending: 0, confirmed: 0, checkedin: 0, cancelled: 0 };
    MOCK_BOOKINGS.forEach(b => { if (counts[b.status] !== undefined) counts[b.status]++; });

    el.innerHTML = `
        <div class="mini-stat"><span class="mini-stat-num" style="color:#F59E0B">${counts.pending}</span><span>รออนุมัติ</span></div>
        <div class="mini-stat"><span class="mini-stat-num" style="color:#22C55E">${counts.confirmed}</span><span>อนุมัติแล้ว</span></div>
        <div class="mini-stat"><span class="mini-stat-num" style="color:#3B82F6">${counts.checkedin}</span><span>เช็คอินแล้ว</span></div>
        <div class="mini-stat"><span class="mini-stat-num" style="color:#EF4444">${counts.cancelled}</span><span>ยกเลิก</span></div>
        <div class="mini-stat"><span class="mini-stat-num" style="color:#6366F1">${MOCK_BOOKINGS.length}</span><span>รวมทั้งหมด</span></div>
    `;
}

/* Filter ตาราง */
function filterBookings(status) {
    renderBookingsTable(status);
}

/* Admin: อนุมัติการจอง */
function adminApprove(id) {
    const booking = MOCK_BOOKINGS.find(b => b.id === id);
    if (!booking) return;
    booking.status = 'confirmed';
    renderBookingsTable(document.getElementById('booking-filter').value);
    flashRow(id, '#DCFCE7');
}

/* Admin: ยกเลิกการจอง */
function adminCancel(id) {
    if (!confirm('ต้องการยกเลิกการจองนี้?')) return;
    const booking = MOCK_BOOKINGS.find(b => b.id === id);
    if (!booking) return;
    booking.status = 'cancelled';
    renderBookingsTable(document.getElementById('booking-filter').value);
    flashRow(id, '#FEE2E2');
}

/* Admin: เช็คอินแทนนักศึกษา */
function adminCheckIn(id) {
    const booking = MOCK_BOOKINGS.find(b => b.id === id);
    if (!booking) return;
    booking.status = 'checkedin';
    renderBookingsTable(document.getElementById('booking-filter').value);
    flashRow(id, '#DBEAFE');
}

/* Flash effect เมื่อมีการเปลี่ยน Status */
function flashRow(id, color) {
    const row = document.getElementById('bk-row-' + id);
    if (!row) return;
    row.style.transition = 'background 0.3s ease';
    row.style.background = color;
    setTimeout(() => { row.style.background = ''; }, 1200);
}

/* =================================================================
   ADMIN: Room Control (ควบคุมห้อง)
================================================================= */
function renderRoomCards() {
    const grid = document.getElementById('rooms-cards-grid');
    if (!grid) return;

    const statusInfo = {
        open:        { label: '🟢 เปิดให้บริการ', cls: 'rc-status-open  rc-open',   toggleable: true  },
        closed:      { label: '🔴 ปิดการใช้งาน',   cls: 'rc-status-closed rc-closed', toggleable: true  },
        maintenance: { label: '🟡 ปิดปรับปรุง',    cls: 'rc-status-maint rc-maint',  toggleable: false },
    };

    grid.innerHTML = MOCK_ROOMS.map(room => {
        const st = statusInfo[room.status] || statusInfo.open;
        const isOpen = room.status === 'open';
        const toggleId = 'toggle-' + room.id;

        return `
            <div class="room-control-card ${st.cls.split(' ')[1]}" id="rc-card-${room.id}">
                <div class="rc-card-header">
                    <span class="rc-room-type-tag">${room.typeLabel}</span>
                </div>
                <p class="rc-room-name">${room.name}</p>
                <p class="rc-room-code">รหัส: ${room.code} · ชั้น ${room.floor} อาคาร ${room.building}</p>

                <div class="rc-stats-row">
                    <div class="rc-stat">ความจุ: <span>${room.capacity} คน</span></div>
                    <div class="rc-stat">จองวันนี้: <span>${room.bookingsToday} ครั้ง</span></div>
                </div>

                <p style="font-size:11px;color:#94A3B8;margin-bottom:12px;">🔧 ${room.equipment}</p>

                <div class="rc-card-footer">
                    <span class="rc-status-label ${st.cls.split(' ')[0]}">${st.label}</span>
                    ${room.status === 'maintenance'
                        ? `<span style="font-size:11px;color:#F59E0B">กำลังซ่อมบำรุง</span>`
                        : `<label class="toggle-switch" title="${isOpen ? 'คลิกเพื่อปิดห้อง' : 'คลิกเพื่อเปิดห้อง'}">
                               <input type="checkbox" id="${toggleId}" ${isOpen ? 'checked' : ''}
                                      onchange="toggleRoom('${room.id}', this.checked)">
                               <span class="toggle-slider"></span>
                           </label>`
                    }
                </div>
            </div>
        `;
    }).join('');

    renderRoomsSummary();
}

/* Toggle สถานะห้อง เปิด/ปิด */
function toggleRoom(roomId, isOpen) {
    const room = MOCK_ROOMS.find(r => r.id === roomId);
    if (!room) return;

    room.status = isOpen ? 'open' : 'closed';

    // อัปเดต Card แบบ Smooth (ไม่ต้อง Re-render ทั้งหน้า)
    const card = document.getElementById('rc-card-' + roomId);
    if (card) {
        card.classList.remove('rc-open', 'rc-closed');
        card.classList.add(isOpen ? 'rc-open' : 'rc-closed');

        const statusLabel = card.querySelector('.rc-status-label');
        if (statusLabel) {
            statusLabel.textContent = isOpen ? '🟢 เปิดให้บริการ' : '🔴 ปิดการใช้งาน';
            statusLabel.className = 'rc-status-label ' + (isOpen ? 'rc-status-open' : 'rc-status-closed');
        }
    }

    renderRoomsSummary();

    // แสดง Toast (ข้อความยืนยันเล็กๆ)
    showToast(isOpen ? `✅ เปิดห้อง "${room.name}" แล้ว` : `🔒 ปิดห้อง "${room.name}" แล้ว`);
}

/* สรุปจำนวนห้อง */
function renderRoomsSummary() {
    const el = document.getElementById('rooms-summary');
    if (!el) return;
    const counts = { open: 0, closed: 0, maintenance: 0 };
    MOCK_ROOMS.forEach(r => { if (counts[r.status] !== undefined) counts[r.status]++; });

    el.innerHTML = `
        <div class="mini-stat"><span class="mini-stat-num" style="color:#22C55E">${counts.open}</span><span>เปิดให้บริการ</span></div>
        <div class="mini-stat"><span class="mini-stat-num" style="color:#EF4444">${counts.closed}</span><span>ปิดการใช้งาน</span></div>
        <div class="mini-stat"><span class="mini-stat-num" style="color:#F59E0B">${counts.maintenance}</span><span>ปิดปรับปรุง</span></div>
        <div class="mini-stat"><span class="mini-stat-num" style="color:#6366F1">${MOCK_ROOMS.length}</span><span>รวมทั้งหมด</span></div>
    `;
}

/* Alert สำหรับปุ่มเพิ่มห้องใหม่ */
function showAddRoomAlert() {
    showAlert('🚧', 'ฟีเจอร์กำลังพัฒนา', 'ฟีเจอร์เพิ่มห้องใหม่อยู่ในระหว่างการพัฒนา จะเปิดใช้งานใน Version ถัดไป');
}

/* =================================================================
   Modal และ Alert Helpers
================================================================= */

/* ปิด Success Modal */
function closeModal(event) {
    if (event && event.target !== document.getElementById('success-modal')) return;
    document.getElementById('success-modal').classList.add('hidden');
}

/* แสดง Alert Modal ทั่วไป */
function showAlert(icon, title, desc) {
    document.getElementById('alert-modal-icon').textContent = icon;
    document.getElementById('alert-modal-title').textContent = title;
    document.getElementById('alert-modal-desc').textContent = desc;
    document.getElementById('alert-modal').classList.remove('hidden');
}

function closeAlertModal(event) {
    if (event && event.target !== document.getElementById('alert-modal')) return;
    document.getElementById('alert-modal').classList.add('hidden');
}

/* Toast Notification เล็กๆ ด้านล่าง */
function showToast(message) {
    let toast = document.getElementById('toast-notif');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notif';
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%) translateY(0);
            background: #1E293B;
            color: #fff;
            padding: 10px 20px;
            border-radius: 99px;
            font-size: 14px;
            font-family: 'Sarabun', sans-serif;
            font-weight: 600;
            z-index: 3000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            transition: opacity 0.3s ease;
            white-space: nowrap;
        `;
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}

/* =================================================================
   เริ่มต้นระบบ (Initialize)
================================================================= */
function init() {
    // เริ่มต้นด้วยโหมด User
    switchRole('user');

    // วาด QR Code เริ่มต้น
    setTimeout(drawQRCode, 100);

    // Render Date Grid เผื่อผู้ใช้กดเข้าหน้าจองเลย
    renderDateGrid();

    console.log('%c📚 LibSpace Mockup Ready!', 'color:#4F46E5;font-size:16px;font-weight:bold;');
    console.log('สลับ Role: switchRole("user") | switchRole("admin")');
    console.log('นำทาง:    navigate("admin-bookings") | navigate("user-ticket")');
}

// เรียกเมื่อ DOM โหลดเสร็จ
document.addEventListener('DOMContentLoaded', init);
