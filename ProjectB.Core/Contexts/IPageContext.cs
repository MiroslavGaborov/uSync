using ProjectB.Models.Generated;

namespace ProjectB.Core.Contexts
{
	public interface IPageContext<out T> : ISiteContext where T : class, IPage
	{
		T Page { get; }
	}
}
