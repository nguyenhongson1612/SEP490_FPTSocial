using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class Gender
    {
        public string GenderId { get; set; } = null!;
        public string GenderName { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual UserGender? UserGender { get; set; }
    }
}
