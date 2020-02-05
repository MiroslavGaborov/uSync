using ProjectB.Models.Generated;

namespace ProjectB.Core.Contexts
{
	public interface ISiteContext
	{
		IPage CurrentPage { get; }
		Home Home { get; }
		ISiteSettings SiteSettings { get; }
	}
}
