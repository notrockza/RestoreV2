using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities.OrderAggregate;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Stripe;

namespace API.Controllers
{

    public class PaymentsController : BaseApiController
    {
        private readonly PaymentService _paymentService;
        private readonly StoreContext _context;
        private readonly IConfiguration _config;
 
        public PaymentsController(PaymentService paymentService, StoreContext context, IConfiguration configuration)
        {
            _context = context;
            _config = configuration;
            _paymentService = paymentService;
        }
 
        [Authorize]
        [HttpPost]
        //ถ้าไม่มีให้ทำการสร้าง //ถ้ามีให้ทำการ update 
        public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
        {
            var basket = await _context.Baskets
                .RetrieveBasketWithItems(User.Identity.Name)
                .FirstOrDefaultAsync();
 
            if (basket == null) return NotFound();
            //ส่งตระกร้าให้
            var intent = await _paymentService.CreateOrUpdatePaymentIntent(basket);
            //ใบส่งของเป็น null หรือป่าว
            if (intent == null) return BadRequest(new ProblemDetails { Title = "Problem creating payment intent" });

            // รหัสใบส่งของมีจริงหรือป่าว
            if (!string.IsNullOrEmpty(intent.Id))
            {   
                //ถ้ามีใส่ลงไปในตระกร้า
                basket.PaymentIntentId = intent.Id;
                basket.ClientSecret = intent.ClientSecret;
            }
 
            _context.Update(basket);
 
            var result = await _context.SaveChangesAsync() > 0;
 
            if (!result) return BadRequest(new ProblemDetails { Title = "Problem updating basket with intent" });


            //เเล้ว return ไปใน ตระกร้าปลอม
            return basket.MapBasketToDto();
        }

        [HttpPost("webhook")] //ใช้ตามเขาไป
        public async Task<ActionResult> StripeWebhook()
        {
            #region รับค่าเข้ามาจาก Webhook และได้รับออกเจค
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"],
            //คำว่า WhSecret ต้องตรงกับใน appsetting
                _config["StripeSettings:WhSecret"], throwOnApiVersionMismatch: false);
            var charge = (Charge)stripeEvent.Data.Object;  // ให้ส่งคำว่า succeeded กลับมา
            #endregion

            //ค้นหา order ตาม PaymentIntentId
            var order = await _context.Orders.FirstOrDefaultAsync(x =>
                x.PaymentIntentId == charge.PaymentIntentId);

            //เปลี่ยน OrderStatus ตามเหตุการณ์ที่ได้รับมา
            if (charge.Status == "succeeded") order.OrderStatus = OrderStatus.PaymentReceived;

            await _context.SaveChangesAsync();

            return new EmptyResult();
        }

 

    }
}