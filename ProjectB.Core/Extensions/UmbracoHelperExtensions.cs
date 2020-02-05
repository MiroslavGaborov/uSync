using Umbraco.Web;
using ProjectB.Core.Contexts;
using ProjectB.Models.Generated;

namespace ProjectB.Core.Extensions
{
	public static class UmbracoHelperExtensions
	{
		public static ISiteContext CreateSiteContext(this UmbracoHelper helper)
			=> new SiteContext(helper);

		public static IPageContext<T> CreatePageContext<T>(this UmbracoHelper helper, T page) where T : class, IPage
			=> new PageContext<T>(page, helper);
	}
}
