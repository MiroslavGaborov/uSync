using ProjectB.Core.Contexts;
using ProjectB.Models.Generated;

namespace ProjectB.Core.ViewModels.Pages
{
	public class SearchResultsViewModel : PageViewModel
	{
		public SearchResultsViewModel(IPageContext<SearchResults> context, string query, int page) : base(context)
		{
			Query = query;
			Page = page;
			ItemsPerPage = context.Page.ItemsPerPage;
		}

		public string Query { get; }
		public int Page { get; }
		public int ItemsPerPage { get; }
	}
}
