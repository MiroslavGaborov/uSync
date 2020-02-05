using Umbraco.Web.Mvc;
using ProjectB.Core.Contexts;
using ProjectB.Core.Extensions;
using ProjectB.Models.Generated;

namespace ProjectB.Core.Controllers.RenderMvc
{
	public abstract class BasePageController<T> : RenderMvcController where T : class, IPage
	{
		protected IPageContext<T> CreatePageContext(T page) => Umbraco.CreatePageContext(page);
	}
}
