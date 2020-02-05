using System.Web.Mvc;
using ProjectB.Core.ViewModels.Partials.Layout;

namespace ProjectB.Core.Controllers.Surface.Partials
{
	public class LayoutController : BaseSurfaceController
	{
		[ChildActionOnly]
		public ActionResult MetaTags(MetaTagsViewModel viewModel) 
			=> PartialView(viewModel);

		[ChildActionOnly]
		public ActionResult Header(HeaderViewModel viewModel)
			=> PartialView(viewModel);

		[ChildActionOnly]
		public ActionResult Footer(FooterViewModel viewModel)
			=> PartialView(viewModel);
	}
}
