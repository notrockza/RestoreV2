using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities.OrderAggregate
{
    // enum อินัม เป็นค่าคงที่ ที่ใช้เเทนตัวเลข
   public enum OrderStatus
    {
        Pending,
        PaymentReceived,
        PaymentFailed
    }

}