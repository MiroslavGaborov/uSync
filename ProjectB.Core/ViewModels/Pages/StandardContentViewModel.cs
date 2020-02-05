using ProjectB.Core.Contexts;
using ProjectB.Models.Generated;

namespace ProjectB.Core.ViewModels.Pages
{
	public class StandardContentViewModel : PageViewModel
	{
		public StandardContentViewModel(IPageContext<StandardContent> context) : base(context)
		{
		}
	}
}