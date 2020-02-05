using System;
using ProjectB.Models.Generated;

namespace ProjectB.Core.ViewModels.Partials.Layout
{
	public class FooterViewModel
	{
		public FooterViewModel(IFooter footer)
		{
			if (footer == null) throw new ArgumentNullException(nameof(footer));

			CopyrightText = footer.CopyrightText;
		}

		public string CopyrightText { get; }
	}
}
