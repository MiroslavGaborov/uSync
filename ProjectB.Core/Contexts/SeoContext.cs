﻿using System;
using ProjectB.Models.Generated;
using ProjectB.Models.DocumentTypes;

namespace ProjectB.Core.Contexts
{
	public class SeoContext<T> : ISeoContext<T> where T : class, ISeo
	{
		private readonly ISiteContext _siteContext;

		public SeoContext(T seo, ISiteContext siteContext)
		{
			_siteContext = siteContext ?? throw new ArgumentNullException(nameof(siteContext));
			Seo = seo ?? throw new ArgumentNullException(nameof(seo));
		}

		public T Seo { get; }
		public IPage CurrentPage => _siteContext.CurrentPage;
		public Home Home => _siteContext.Home;
		public ISiteSettings SiteSettings => _siteContext.SiteSettings;
	}
}
