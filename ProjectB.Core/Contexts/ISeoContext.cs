using ProjectB.Models.DocumentTypes;

namespace ProjectB.Core.Contexts
{
	public interface ISeoContext<out T> : ISiteContext where T : class, ISeo
	{
		T Seo { get; }
	}
}
