using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Core.Helper
{
    public class GetEdgeRankAlo
    {
        public double GetEdgeRank(int ReactCount, int CommentCount, int ShareCount, DateTime CreateAt)
        {
            double timeDecayFactor = Math.Exp(-(DateTime.Now - CreateAt).TotalHours / 0.5);
            int interactionScore = ReactCount * 3 + CommentCount + ShareCount;
            return timeDecayFactor * interactionScore;
        }

    }
}
