using System.Web.Mvc;
using Umbraco.Web.Mvc;
using ProjectB.Core.ViewModels.Pages;
using ProjectB.Models.DocumentTypes;

namespace ProjectB.Core.Controllers.RenderMvc
{
	public class XMLSitemapController : RenderMvcController
	{
		public ActionResult XMLSitemap(IDomainRoot model)
			=> CurrentTemplate(new XMLSitemapViewModel(model));
	}
}
