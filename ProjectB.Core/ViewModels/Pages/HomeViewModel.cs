using ProjectB.Core.Contexts;
using ProjectB.Models.Generated;

namespace ProjectB.Core.ViewModels.Pages
{
	public class HomeViewModel : PageViewModel
	{
		public HomeViewModel(IPageContext<Home> context) : base(context)
		{
		}
	}
}
