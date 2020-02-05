using System.Web.Mvc;
using ProjectB.Core.Extensions;
using ProjectB.Core.ViewModels.Pages;
using ProjectB.Models.Generated;

namespace ProjectB.Core.Controllers.RenderMvc
{
	public class SearchResultsController : BasePageController<SearchResults>
	{
		public ActionResult Index(SearchResults model)
			=> CurrentTemplate(
				new SearchResultsViewModel(CreatePageContext(model), 
				Request.GetQueryParameter(),
				Request.GetPageParameter()));
	}
}
