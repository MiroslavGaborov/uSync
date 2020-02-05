using System;
using Umbraco.Web;
using ProjectB.Core.Extensions;
using ProjectB.Core.ViewModels.Shared;
using ProjectB.Models.Generated;

namespace ProjectB.Core.ViewModels.Partials.Layout
{
	public class HeaderViewModel
	{
		public HeaderViewModel(IHeader header)
		{
			if (header == null) throw new ArgumentNullException(nameof(header));

			//Logo = header.Logo.ToViewModel();
			LogoUrl = header.AncestorOrSelf<Home>().Url;
		}

		public ImageViewModel Logo { get; }
		public string LogoUrl { get; }
	}
}
