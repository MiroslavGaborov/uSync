using System.Web.Mvc;
using ProjectB.Core.ViewModels.Pages;
using ProjectB.Models.Generated;

namespace ProjectB.Core.Controllers.RenderMvc
{
	public class HomeController : BasePageController<Home>
	{
		public ActionResult Index(Home model) 
			=> CurrentTemplate(new HomeViewModel(CreatePageContext(model)));
	}
}
