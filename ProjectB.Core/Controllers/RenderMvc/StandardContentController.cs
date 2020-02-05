using ProjectB.Core.ViewModels.Pages;
using ProjectB.Models.Generated;
using System.Web.Mvc;

namespace ProjectB.Core.Controllers.RenderMvc
{
    public class StandardContentController : BasePageController<StandardContent>
    {
        public ActionResult Index(StandardContent model)
            => CurrentTemplate(new StandardContentViewModel(CreatePageContext(model)));
    }
}
