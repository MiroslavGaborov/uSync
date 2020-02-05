using Examine;
using Umbraco.Core;
using Umbraco.Core.Composing;
using Umbraco.Web;
using ProjectB.Search.Services;
using ProjectB.Search.Services.Implementation;

namespace ProjectB.Core.Composers
{
	public class SearchComposer : IUserComposer
	{
		public void Compose(Composition composition)
		{
			composition.RegisterFor<ISearchService, SearchService>(f => new SearchService(f.GetInstance<IExamineManager>(), f.GetInstance<IUmbracoContextAccessor>()));
		}
	}
}
